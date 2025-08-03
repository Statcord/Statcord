import { defineEventHandler, getQuery, createError, getRouterParams, sendError, appendCorsPreflightHeaders } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session?.accessToken && bot[0].ownerid === event.context.session?.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)
	const runInfluxQuery = new event.context.influx.influxRun(
		{
			time: query.t,
			botID: path.botID
		}
	)
	runInfluxQuery.formatTime(query.t)
	const returnedData = await runInfluxQuery.getData()
	const data = {
		default: returnedData[1].value,
	}

	return [
		{
            name: "Guilds",
            value: getLastStat(data.default, "guildCount")
        },
        {
            name: "Members",
            value: getLastStat(data.default, "members")
        },
        {
            name: "Users",
            value: getLastStat(data.default, "userCount")
        }
    ]
})

export const schema = {
	hidden: true,
	parameters: [
		{
			name: 'botID',
			in: 'path',
			required: true,
			content: { media: 'application/json' }
		},
		{
			name: "start",
			in: "query",
			required: false,
			
			"schema": {
				"type": "string",
				"format": "date",
				default: "0",
				example: "1685577600000"
			},
			"description": "The start date to filter the data by"
		},
		{
			name: "end",
			in: "query",
			required: false,
			"schema": {
				"type": "string",
				"format": "date",
				default: "Whatever today is",
				example: "1685577600000"
			},
			"description": "The end date to filter the data by"
		},
		{
			name: "groupBy",
			in: "query",
			required: false,
			"schema": {
				"type": "string",
				example: "1d",
				default: "1d"
			},
			"description": "The timespan to group by. (day, month year)"
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
						type: "array",
                        contains: { type: "object" }
					}
				}
			}
		}
	}
}

const getLastStat = (mainStats, stat) => {
	const relatedStats = mainStats.filter(stats=>stats._field===stat)
	return relatedStats[relatedStats.length-1]?._value
}