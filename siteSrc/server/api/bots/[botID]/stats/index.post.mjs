import { defineEventHandler, sendNoContent, readBody, getHeader, createError, sendError, getRouterParams } from "h3"

const mainStatsKeys = [
    "guildCount",
	"shardCount",
	"userCount",
	"members",
	"ramUsage",
	"totalRam",
	"cpuUsage"
]
const isNanOrInfinity = number => {
	if (isNaN(number) || number === Infinity) return 0
	return number
}
export default defineEventHandler(async event => {
	const body = await readBody(event)
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (getHeader(event, "authorization") !== botExisits[0].token) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const statsPostBodyKeys = Object.keys(body)
    const hasMainStats = mainStatsKeys.some(key=>statsPostBodyKeys.includes(key))
    if (!hasMainStats && !body.customCharts && !body.topCommands) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	// if (statsPostBodyKeys.filter(k=>k.toLowerCase().includes("ram")).length === 1) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	if (body.customCharts){
		if (body.customCharts.length > botExisits[0].maxcustomcharts) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
		
		const existingCustomCharts = await event.context.pgPool`SELECT chartid AS id from chartsettings WHERE botid = ${path.botID} AND category = 'custom'`.catch(() => {})
		if ([...existingCustomCharts, ...body.customCharts].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).length > botExisits[0].maxcustomcharts) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	}

	const date = new Date().toISOString().replace("T", " ")
	
	const customCharts = body.customCharts?.map(i=>{const keys = Object.keys(i.data); return {botid: path.botID, timestamp: date, chartid: i.id, name: `placeholder for ${i.id}`, label: `placeholder for ${i.id}`,type: 'line', category: 'custom', value: isNanOrInfinity(Number(i.data[keys[0]]))}}) ?? []
	const customchartsIN = customCharts.map(({botid, chartid, value})=>{return {botid, chartid, value}})
	const chartsettingsIN = customCharts.map(({botid, chartid, name, label, type, category})=>{return {botid, chartid, name, label, type, category}})
	event.context.pgPool`INSERT INTO customcharts ${event.context.pgPool(customchartsIN)}`.catch(() => {})
	event.context.pgPool`INSERT INTO chartsettings ${event.context.pgPool(chartsettingsIN)} ON CONFLICT (botid, chartid) DO NOTHING`.catch(() => {})

	const topCommands = body.topCommands?.map(item => {return {botid: path.botID, command: item.name, amount: isNanOrInfinity(Number(item.count)), timestamp: date}})??[]
	if (topCommands.length !==0) event.context.pgPool`INSERT INTO commandsrun ${event.context.pgPool(topCommands)}`.catch(() => {})

	event.context.pgPool`INSERT INTO mainstats(botid, guildcount, usercount, members, ramusage, totalram, cpuusage, shardcount, timestamp) VALUES (${path.botID}, ${isNanOrInfinity(Number(body.guildCount ?? 0))}, ${isNanOrInfinity(Number(body.userCount ?? 0))}, ${isNanOrInfinity(Number(body.members ?? 0))}, ${isNanOrInfinity(Number(body.ramUsage ?? 0))}, ${isNanOrInfinity(Number(body.totalRam ?? 0))}, ${isNanOrInfinity(Number(body.cpuUsage ?? 0))}, ${isNanOrInfinity(Number(body.shardCount ?? 0))}, ${date})`.catch(() => {})

	sendNoContent(event, 200)

	// keep track of when the last 10 posts occurred and the average time betwen them
	// const posts = JSON.parse(await event.context.redis.get(`botPostingIntervals:${path.botID}`)) ?? {dates: []}
	// posts.dates.push(new Date().getTime())
	// while (posts.dates.length > 10) posts.dates.shift()
	// await event.context.redis.set(`botPostingIntervals:${path.botID}`, JSON.stringify(posts))

	event.context.pgPool`UPDATE bots SET lastact = now() where botid = ${path.botID}`.catch(() => {})
	event.context.redis.del(`legacyRouteTracking:${path.botID}`);
})

export const schema = {
	"tags": [
		"Bot Stats"
	],
    parameters: [
		{
			name: 'botID',
			in: 'path',
			required: true,
			example: "726560538145849374",
			content: { media: 'application/json' }
		},
		{
			name: 'Authorisation',
			in: 'header',
			example: 'SC-17812626251248269fcfb24b7',
			required: true,
			content: { media: 'application/json' }
		}
    ],
	"security": {
		"PostKey": [{}]
	},
	"requestBody": {
		"description": "Post a bots stats. At least one field is required. Both totalRam and ramUsage are REQUIRED if posting your ram usage.",
		"content": {
			"application/json": {
				"schema": {
					"type": "object",
					"properties": {
						"guildCount": {
							type: "integer",
							"format": "int32",
							example: 22000,
							"description": "The bot's guild count",
							required: false
						},
						"shardCount": {
							type: "integer",
							"format": "int32",
							example: 14,
							"description": "The bot's shard count",
							required: false
						},
						"userCount": {
							type: "integer",
							"format": "int32",
							example: 366051,
							"description": "The activate user count",
							required: false
						},
						"members": {
							type: "integer",
							"format": "int32",
							example: 7687071,
							"description": "The total member count",
							required: false
						},
						"ramUsage": {
							type: "integer",
							"format": "float",
							example: 50.6,
							required: false,
							"description": "The amount of RAM the bot's process is using currently in bytes"
						},
						"totalRam": {
							type: "integer",
							"format": "float",
							"description": "The total amount of RAM available to the bot in bytes",
							required: false
						},
						"cpuUsage": {
							type: "integer",
							"format": "float",
							"description": "The CPU usage of the bot or host",
							example: 10.1,
							required: false
						},
						"customCharts": {
							required: false,
							type: "array",
							"description": "An array of custom chart data",
							example: [
								{
									id: "customChartOne",
									data: {
										"itemOne": 213,
										"itemTwo": 2.13
									}
								}
							],
							"items": {
								type: "object",
								"properties": {
									id: {
										type: "string",
										example: "customChartOne",
										"description": "The ID of the custom chart",
										required: true
									},
									data: {
										type: "object",
										example: {
											"itemOne": 213,
											"itemTwo": 2.13
										},
										"description": "The data for the custom chart",
										required: true
									}
								}
							}
						},
						"topCommands": {
							required: false,
							type: "array",
							"description": "An array of the commands run since the last post",
							example: [
								{
									name: "help",
									count: 10
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
										type: "integer",
										"format": "int32",
										example: 10,
										"description": "The amount the command has been run",
										required: true
									}
								}
							}
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
