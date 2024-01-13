import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"
import { flux, fluxDuration } from "@influxdata/influxdb-client"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)

	const start = new Date(Number(query.start ?? 0)).toISOString()
	const stop = query.end ? new Date(Number(query.end)).toISOString() : new Date().toISOString()

	// console.time("first")
	const mainStats = await fetchFromInflux({
		event,
		measurement: "botStats",
		start,
		stop,
		groupBy: query.groupBy ?? "1d",
		botID: path.botID
	})
	// console.timeEnd("first")

	// console.time("second")
	const commands = await fetchFromInflux({
		event,
		measurement: "customCharts",
		start,
		stop,
		groupBy: query.groupBy ?? "1d",
		botID: path.botID
	})
	// console.timeEnd("second")

	// console.time("thrid")
	const custom = await fetchFromInflux({
		event,
		measurement: "topCommands",
		start,
		stop,
		groupBy: query.groupBy ?? "1d",
		botID: path.botID
	})
	// console.timeEnd("thrid")

	const types = await event.context.pgPool`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${path.botID}`.catch(() => {})

	return {
		mainStats,
		commands,
		custom,
		types
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
						type: "object",
						properties: {
							mainStats: {
								type: "array",
								contains: { type: "object" }
							},
							commands: {
								type: "array",
								contains: { type: "object" }
							},
							custom: {
								type: "array",
								contains: { type: "object" }
							},
							types:{
								type: "array",
								contains: { type: "object" }
							}
						}
					}
				}
			}
		}
	}
}

const fetchFromInflux = async (options) => {
	const queryApi = options.event.context.influx.influxClient.getQueryApi("disstat")

	const fluxQuery = flux`import "math"
	from(bucket:"defaultBucket")
	|> range(start: time(v: ${options.start}), stop: time(v: ${options.stop}))
	|> filter(fn: (r) => r._measurement == ${options.measurement})
	|> filter(fn: (r) => r["botid"] == ${options.botID})
	|> aggregateWindow(every: ${fluxDuration(options.groupBy ?? "1d")}, fn: mean, createEmpty: false)
    |> map(fn: (r) => ({r with _value: math.round(x: r._value)}))
	|> yield(name: "mean")`
	// this slows down requests by 9.92%
	// |> group(columns: ["_time", "_field"])

	let outData = [];
	for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
		const tableObject = tableMeta.toObject(values)

		const timeIndex = outData.findIndex(element => element.time === tableObject._time)
		if (timeIndex === -1) outData.push({
			time: tableObject._time,
			[tableObject._field]: tableObject._value
		})
		else outData[timeIndex][tableObject._field] = tableObject._value
	}

	return outData;
}