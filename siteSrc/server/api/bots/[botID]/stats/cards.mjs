import { defineEventHandler, getQuery, createError, getRouterParams, sendError, appendCorsPreflightHeaders } from "h3"
import { flux, fluxDuration } from "@influxdata/influxdb-client"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session?.accessToken && bot[0].ownerid === event.context.session?.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)

	const time = formatTime(query.t)

	const runInfluxQuery = new influxRun(
		{
			event,
			...time,
			botID: path.botID
		}
	)

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

const formatTime = (t)=>{
	const range = t[t.length-1].toLowerCase();
	const value = range == 'e' ? 1 : Number(t.match(/\d+/)[0]);

	const now = new Date();
	const end = new Date();
	switch (range){
		case "e":{
			end.setTime(0)
			return {
				start: end.toISOString(),
				stop: now.toISOString(),
				groupBy: "1d"
			}
			break;
		}
		case "h":{
			end.setTime(now.getTime()-((60*60*1000) * value))
			return {
				start: end.toISOString(),
				stop: now.toISOString(),
				groupBy: "1h"
			}
			break;
		}
		case "d":{
			end.setTime(now.getTime()-((24*60*60*1000) * value))
			return {
				start: end.toISOString(),
				stop: now.toISOString(),
				groupBy: "1d"
			}
			break;
		}
		case "o":{
			end.setTime(now.getTime()-((30*24*60*60*1000) * value))
			return {
				start: end.toISOString(),
				stop: now.toISOString(),
				groupBy: "1d"
			}
			break;
		}
		case "y":{
			end.setTime(now.getTime()-((12*30*24*60*60*1000) * value))
			return {
				start: end.toISOString(),
				stop: now.toISOString(),
				groupBy: "1d"
			}
			break;
		}
		default: {
			console.log(value)
			console.log(range)
		}
	}
}

const influxRun = class{
	#queryApi
	#botID
	#start
	#end
	#groupBy
	constructor(options){
		this.#queryApi = options.event.context.influx.influxClient.getQueryApi("disstat")
		this.#botID = options.botID
		this.#start = options.start
		this.#end = options.stop
		this.#groupBy = options.groupBy
	}
	async runQuery(measurement){
		const fluxQuery = flux`from(bucket:"defaultBucket")
		|> range(start: time(v: ${this.#start}), stop: time(v: ${this.#end}))
		|> filter(fn: (r) => r._measurement == ${measurement})
		|> filter(fn: (r) => r["botid"] == ${this.#botID})
		|> aggregateWindow(every: ${fluxDuration(this.#groupBy)}, fn: mean, createEmpty: false)
		|> yield(name: "mean")`
		// |> map(fn: (r) => ({r with _value: math.round(x: r._value)}))
	
		const tableObjects = []
		for await (const { values, tableMeta } of this.#queryApi.iterateRows(fluxQuery)) {
			tableObjects.push(tableMeta.toObject(values))
		}
		
		return tableObjects
	}
	async getData (){
		return Promise.allSettled([
			this.runQuery("customCharts"),
			this.runQuery("botStats"),
			this.runQuery("topCommands")
		])
	}
}

const getLastStat = (mainStats, stat) => {
	const relatedStats = mainStats.filter(stats=>stats._field===stat)
	return relatedStats[relatedStats.length-1]?._value
}