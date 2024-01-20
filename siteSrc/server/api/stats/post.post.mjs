import { defineEventHandler, sendNoContent, readBody, getHeader, createError, sendError } from "h3"
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

export default defineEventHandler(async event => {
	const body = await readBody(event)
	if (!body.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${body.id}`.catch(() => {})
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
		
		const existingCustomCharts = await event.context.pgPool`SELECT chartid AS id from chartsettings WHERE botid = ${body.id} AND custom = true`.catch(() => {})
		if ([...existingCustomCharts, ...body.customCharts].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).length > botExisits[0].maxcustomcharts) {
			writeClient.flush()
			return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
		}
		
		body.customCharts.map(customChart => {
			event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type, custom) VALUES (${body.id}, ${customChart.id}, ${`placeholder for ${customChart.id}`}, ${`placeholder for ${customChart.id}`}, 'line', true) ON CONFLICT (botid, chartid) DO NOTHING`.catch(() => {})

			const customChartsPoint = new Point("customCharts")
				.tag("botid",  body.id)
				.tag("customChartID",  customChart.id)

			Object.keys(customChart.data).forEach(key => {
				const value = customChart.data[key]
				if (value.toString().includes(".")) customChartsPoint.floatField(key, value)
				else customChartsPoint.intField(key, value)
			})

			writeClient.writePoint(customChartsPoint)
		})
	}

    if (hasMainStats){
        const mainStatsPoint = new Point("botStats")
        .tag("botid",  body.id)

        mainStatsKeys.forEach(key=>{
            if (statsPostBodyKeys.includes(key)) mainStatsPoint[mainStats[key]](key, body[key])
        })
        writeClient.writePoint(mainStatsPoint)
    }

	if (body.topCommands) {
		const topCommandsPoint = new Point("topCommands")
			.tag("botid",  body.id)

		body.topCommands.map(item => {
			topCommandsPoint.intField(item.name, item.count)
		})

		writeClient.writePoint(topCommandsPoint)
	}

	writeClient.flush()

	sendNoContent(event, 200)
})

export const schema = {
	"tags": [
		"Bot Stats"
	],
    parameters: [
		{
			name: 'Authorisation',
			in: 'header',
			required: true,
			content: { media: 'application/json' }
		}
    ],
	"security": {
		"Authorisation": [{}]
	},
	"requestBody": {
		"description": "Post a bots stats. At least one optional field is required. Both totalRam and ramUsage are REQUIRED if posting your ram usage.",
		"content": {
			"application/json": {
				"schema": {
					"type": "object",
					"properties": {
						"id":  {
							type: "string",
							example: "961433265879801936",
							"description": "The bot's ID",
							required: true
						},
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