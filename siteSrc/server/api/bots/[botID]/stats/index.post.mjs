import { defineEventHandler, sendNoContent, readBody, getHeader, createError, sendError, getRouterParams } from "h3"
import { Point } from "@influxdata/influxdb-client"

const mainStats = {
    "guildCount": "intField",
	"shardCount": "intField",
	"userCount": "intField",
	"members": "intField",
	"ramUsage": "floatField",
	"totalRam": "floatField",
	"cpuUsage": "floatField"
}
const mainStatsKeys = Object.keys(mainStats)
const average = array => array.reduce((a, b) => a + b) / array.length;

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
	if (statsPostBodyKeys.filter(k=>k.toLowerCase().includes("ram")).length === 1) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const writeClient = event.context.influx.influxClient.getWriteApi("disstat", "defaultBucket")

	if (body.customCharts){
		if (body.customCharts.length > botExisits[0].maxcustomcharts) {
			writeClient.flush()
			return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
		}
		
		const existingCustomCharts = await event.context.pgPool`SELECT chartid AS id from chartsettings WHERE botid = ${path.botID} AND category = 'custom'`.catch(() => {})
		if ([...existingCustomCharts, ...body.customCharts].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).length > botExisits[0].maxcustomcharts) {
			writeClient.flush()
			return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
		}

		event.context.pgPool.begin(async sql => {
			return body.customCharts.map(async customChart => {
				const [chartsettingsInsert] = await sql`INSERT INTO chartsettings(botid, chartid, name, label, type, category) VALUES (${path.botID}, ${customChart.id}, ${`placeholder for ${customChart.id}`}, ${`placeholder for ${customChart.id}`}, 'line', 'custom') ON CONFLICT (botid, chartid) DO NOTHING`.catch(() => {})
	
				const customChartsPoint = new Point("customCharts")
					.tag("botid",  path.botID)
					.tag("customChartID",  customChart.id)
	
				Object.keys(customChart.data).forEach(key => {
					const value = customChart.data[key]
					if (value.toString().includes(".")) customChartsPoint.floatField(key, isNaN(value) ? 0 : value)
					else customChartsPoint.intField(key, isNaN(value) ? 0 : value)
				})
	
				writeClient.writePoint(customChartsPoint)

				return chartsettingsInsert
			})
		})
	}

    if (hasMainStats){
        const mainStatsPoint = new Point("botStats")
        .tag("botid",  path.botID)

        mainStatsKeys.forEach(key=>{
            if (statsPostBodyKeys.includes(key)) mainStatsPoint[mainStats[key]](key, body[key])
        })
        writeClient.writePoint(mainStatsPoint)
    }

	if (body.topCommands) {
		const topCommandsPoint = new Point("topCommands")
			.tag("botid",  path.botID)

		body.topCommands.map(item => {
			topCommandsPoint.intField(item.name, item.count)
		})

		writeClient.writePoint(topCommandsPoint)
	}

	writeClient.flush()

	sendNoContent(event, 200)

	if (await event.context.redis.exists(`legacyRouteTracking:${path.botID}`)) event.context.redis.del(`legacyRouteTracking:${path.botID}`);

	// keep track of when the last 10 posts occurred and the average time betwen them
	const posts = JSON.parse(await event.context.redis.get(`botPostingIntervals:${path.botID}`)) ?? {
		dates: [],
		times:[]
	}
	posts.dates.push(new Date().getTime())
    if (posts.dates.length >= 2) posts.times = posts.dates.slice(1).map((value, index) => value - posts.dates[index]);
	while (posts.dates.length > 10) posts.dates.shift()
	while (posts.times.length > 10) posts.times.shift()
	if (posts.times.length >= 2) posts.average = average(posts.times)
	await event.context.redis.set(`botPostingIntervals:${path.botID}`, JSON.stringify(posts))
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