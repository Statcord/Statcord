import { defineEventHandler, createError, getRouterParams, sendError, appendCorsPreflightHeaders } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (!bot[0].public) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const botStats = (await event.context.pgPool`SELECT guildcount, usercount, shardcount FROM mainstats WHERE botid = ${path.botID} ORDER by timestamp desc limit 1`.catch(() => {}))[0]
	const topCommands = (await event.context.pgPool`select command, sum(amount) from commandsrun where botid = ${path.botID} group by command`.catch(() => {})).map(a=>{
		let b = {}
		b[command] = a.sum
		return b
	})
	const customcharts = (await event.context.pgPool`select chartid, value from (select max(timestamp) from customcharts where botid = ${path.botID})  a, customcharts where botid = ${path.botID} and timestamp = a.max`).map(a=>{
		let b = {}
		b[chartid] = a.value
		return b
	})

	appendCorsPreflightHeaders(event, {"allowHeaders": "*"})

	return {
		botStats,
		topCommands,
		customcharts
	}
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
								type: "array",
								"description": "Array with the latest custom charts and their values",
								contains: {
									type: "object"
								},
								example: [
									{
										"itemOne": 213,
										"itemTwo": 2.13
									}
								]
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