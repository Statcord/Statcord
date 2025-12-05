import { defineEventHandler, createError, sendError, readBody } from "h3"
import { useRuntimeConfig } from '#imports';

const isNanOrInfinity = number => {
	if (isNaN(number) || number === Infinity) return 0
	return number
}

const {configFile} = useRuntimeConfig()

export default defineEventHandler(async event => {
	const body = await readBody(event)

	if (!body.key.startsWith("statcord.com")) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
	if (!body.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	
	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${body.id}`.catch(() => {})
	if (!botExisits[0]) {
		if (await event.context.redis.exists(`botDubbleNotifCheck:${body.id}`)) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
		fetch(configFile.webhooks.newSt, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"embeds": [{"title": "New statcord bot found", "color": 5814783, "fields": [{"name": "id", "value": body.id, "inline": true}, {"name": "token", "value": body.key, "inline": true}]}]})}).catch(()=>{})
		event.context.redis.set(`botDubbleNotifCheck:${body.id}`, 1)
		return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	}
	if (body.key !== botExisits[0].token) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const date = new Date().toISOString().replace("T", " ")
	
	const customCharts = [{name: "placeholder for custom1", label: "placeholder for custom1", botid: body.id, "chartid": "custom1", "value": isNanOrInfinity(Number(body.custom1 ?? 0)), type: 'line', category: "custom", timestamp: date}, {name: "placeholder for custom2", label: "placeholder for custom2", botid: body.id, "chartid": "custom2", "value": isNanOrInfinity(Number(body.custom2 ?? 0)), type: 'line', category: "custom", timestamp: date}, {name: "placeholder for bandwidth", label: "placeholder for bandwidth", botid: body.id, "chartid": "bandwidth", "value": isNanOrInfinity(Number(body.bandwidth ?? 0)), type: 'line', category: "custom", timestamp: date}]
	const customchartsIN = customCharts.map(({botid, chartid, value})=>{return {botid, chartid, value}})
	const chartsettingsIN = customCharts.map(({botid, chartid, name, label, type, category})=>{return {botid, chartid, name, label, type, category}})
	event.context.pgPool`INSERT INTO customcharts ${event.context.pgPool(customchartsIN)}`.catch(() => {})
	event.context.pgPool`INSERT INTO chartsettings ${event.context.pgPool(chartsettingsIN)} ON CONFLICT (botid, chartid) DO NOTHING`.catch(() => {})

	const popular = body.popular?.map(item => {return {botid: body.id,command: item.name,amount: isNanOrInfinity(Number(item.count)), timestamp: date}})??[]
	if (popular.length !==0) event.context.pgPool`INSERT INTO commandsrun ${event.context.pgPool(popular)}`.catch(() => {})
	
	event.context.pgPool`INSERT INTO mainstats(botid, guildcount, usercount, members, ramusage, totalram, cpuusage, timestamp) VALUES (${body.id}, ${isNanOrInfinity(Number(body.servers ?? 0))}, ${isNanOrInfinity(Number(body.active.length ?? 0))}, ${isNanOrInfinity(Number(body.users ?? 0))}, ${isNanOrInfinity(Number(body.memactive ?? 0))}, ${isNanOrInfinity(Number(body.memactive ?? 0)/(Number(body.memload ?? 0)/100))}, ${isNanOrInfinity(Number(body.cpuload ?? 0))}, ${date})`.catch(() => {})

	sendError(event, createError({statusCode: 400, statusMessage: `/logan/stats and /v3/stats endpoint are EOL. Switch to the currently supported route /api/bots/{botID}/stats`}))

	// keep track of when the last 10 posts occurred and the average time betwen them
	// const posts = JSON.parse(await event.context.redis.get(`botPostingIntervals:${body.id}`)) ?? {dates: []}
	// posts.dates.push(new Date().getTime())
	// while (posts.dates.length > 10) posts.dates.shift()
	// await event.context.redis.set(`botPostingIntervals:${body.id}`, JSON.stringify(posts))
	// event.context.pgPool`UPDATE bots SET lastact = now() where botid = ${body.id}`.catch(() => {})

	event.context.redis.set(`legacyRouteTracking:${body.id}`, "v3")
})

export const schema = {
	deprecated: true,
	"tags": [
		"Bot Stats"
	],
    parameters: [
		{
			name: 'key',
			in: 'body',
			required: true,
			content: { media: 'application/json' }
		}
    ],
	"security": {
		"key": [{}]
	},
	"requestBody": {
		"description": "Post a bots stats (Statcord compatable). Both memactive and memload are REQUIRED if posting your ram usage.",
		"content": {
			"application/json": {
				"schema": {
					"type": "object",
					"properties": {
						"id":  {
							type: "string",
							example: "961433265879801936",
							"description": "Your Bot's Discord ID.",
							required: true
						},
						"key":  {
							type: "string",
							example: "statcord.com-0123456789abcdefghij",
							"description": "Your Statcord Key",
							required: true
						},
						"servers": {
							type: "integer",
							"format": "int32",
							example: 22000,
							"description": "The amount of servers your bot is in",
							required: true
						},
						"users": {
							type: "integer",
							"format": "int32",
							example: 366051,
							"description": "The amount of users your bot is servicing",
							required: true
						},
						"active": {
							required: false,
							type: "array",
							"description": "An array of users who have run at least 1 command.",
							example: [
								"726515812361437285"
							],
							"items": {
								type: "string"
							}
						},
						"commands": {
							type: "integer",
							"format": "int32",
							example: 366051,
							"description": "[unused] The amount of commands that have been run",
							required: false
						},
						"popular": {
							type: "array",
							"description": "An array of the top 5 commands run",
							required: false,
							example: [
								{
									name: "help",
									count: "10"
								}
							],
							"items": {
								type: "object",
								"properties": {
									name: {
										type: "string",
										example: "help",
										"description": "The name of the command",
										required: true
									},
									count: {
										type: "string",
										example: "10",
										"description": "The amount the command has been run",
										required: true
									}
								}
							}
						},
						"memactive": {
							type: "integer",
							"format": "float",
							example: 5000000000,
							"description": "The amount of memory that is in use. (In Bytes)",
							required: false
						},
						"memload": {
							type: "integer",
							"format": "float",
							example: 50,
							"description": "The % of memory that is in use",
							required: false
						},
						"cpuload": {
							type: "integer",
							"format": "float",
							"description": "The CPU usage of the bot or host",
							example: 10.1,
							required: false
						},
						"bandwidth": {
							type: "integer",
							"format": "float",
							example: 5000000,
							"description": "The amount of network bandwidth used. (In Bytes)",
							required: false
						},
						"custom1": {
							type: "integer",
							"format": "int32",
							example: 14,
							"description": "The value for custom graph 1",
							required: false
						},
						"custom2": {
							type: "integer",
							"format": "int32",
							example: 14,
							"description": "The value for custom graph 2",
							required: false
						}
					}
				}
			}
		}
	},
	"responses": {
		401: {
			"description": "You do not have permission to access this bot.",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 401,
							"statusMessage": "Unauthorized"
						}
					]
				}
			}
		},
		400: {
			"description": "Bad request. One or more Key-value pairs are either missing or have unsupported data",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 400,
							"statusMessage": "Bad Request"
						}
					]
				}
			}
        },
		404:{
			"description": "Bot not found",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 409,
							"statusMessage": "Bot does not exist"
						}
					]
				}
			}
		},
		200: {
			"description": "Bot added successfully",
		}
	}
}
