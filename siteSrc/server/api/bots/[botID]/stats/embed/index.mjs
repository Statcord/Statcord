import { defineEventHandler, createError, getRouterParams, sendError, appendCorsPreflightHeaders } from "h3"
import { flux } from "@influxdata/influxdb-client"

const fluxStart = new Date(0).toISOString()

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (!bot[0].public) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const queryApi = event.context.influx.influxClient.getQueryApi("disstat")
	const fluxQuery = flux`from(bucket: "defaultBucket")
	|> range(start: time(v: ${fluxStart}), stop: time(v: ${new Date().toISOString()}))
	|> filter(fn: (r) => r["botid"] == ${path.botID})
	|> last()`

	appendCorsPreflightHeaders(event, {"allowHeaders": "*"})

	return await formatFluxQueryResult(queryApi, fluxQuery)
})

export const schema = {
	parameters: [
		{
			name: 'botID',
			in: 'path',
			required: true,
			content: { media: 'application/json' }
		},
		{
			name: 'Authorisation',
			in: 'header',
			required: true,
			content: { media: 'application/json' }
		}
	],
	tags: [
		"Bot Stats"
	],
	responses: {
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
		404: {
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
			"content": {
				"application/json": {
					"schema": {
						type: "object",
						properties: {
							botStats: {
								type: "object",
								properties: {
									"guildCount": {
										type: "integer",
										"format": "int32",
										example: 22000,
										"description": "The bot's guild count",
									},
									"shardCount": {
										type: "integer",
										"format": "int32",
										example: 14,
										"description": "The bot's shard count",
									},
									"userCount": {
										type: "integer",
										"format": "int32",
										example: 366051,
										"description": "The activate user count",
									},
									"members": {
										type: "integer",
										"format": "int32",
										example: 7687071,
										"description": "The total member count",
									},
									"ramUsage": {
										type: "integer",
										"format": "float",
										example: 50.6,
										"description": "The amount of RAM the bot's process is using currently in bytes"
									},
									"totalRam": {
										type: "integer",
										"format": "float",
										"description": "The total amount of RAM available to the bot in bytes",
									},
									"cpuUsage": {
										type: "integer",
										"format": "float",
										"description": "The CPU usage of the bot or host",
										example: 10.1,
									}
								}
							},
							customCharts:{
								type: "object",
								"description": "Object with the latest custom charts and their values",
								properties: {}
							},
							topCommands: {
								type: "object",
								"description": "Object with the latest commands run and their counts",
								properties: {}
							}
						}
					}
				}
			}
		}
	}
}

const formatFluxQueryResult = async (queryApi, fluxQuery) => {
	const outObject = {}

	for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
		const tableObject = tableMeta.toObject(values)

		if (!outObject[tableObject._measurement]) outObject[tableObject._measurement] = {}
		if (tableObject._measurement === "customCharts") {
			outObject[tableObject._measurement][tableObject.customChartID]={}
			outObject[tableObject._measurement][tableObject.customChartID][tableObject._field] = tableObject._value
		} else outObject[tableObject._measurement][tableObject._field] = tableObject._value
	}
	
	return outObject
}