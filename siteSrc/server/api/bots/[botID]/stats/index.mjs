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

	const types = await event.context.pgPool`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${path.botID} AND custom = false`.catch(() => {})

	const runInfluxQuery = new influxRun(
		{
			event,
			start,
			stop,
			groupBy: query.groupBy ?? "1d",
			botID: path.botID
		}
	)

	// console.time("first")
	const mainStatsInflux = await runInfluxQuery.runQuery("botStats")
	const labels = [...new Set(mainStatsInflux.map(({_time})=>_time))]
	const mainStats = types.map(type => {
		if (!type.enabled) return;

		return {
			name: type.name,
			type: type.type,
			data: {
				datasets: [
					{
						label: type.label,
						data:  mainStatsInflux.filter(stat=>stat._field===type.chartid).map(({_value})=>_value.toFixed(2))
					}
				]
			}
		}		
	}).filter(a=>typeof a !== "undefined")


	const memusage = mainStats.findIndex(a=>a.name==="Ram Usage")
	const totalMEM = mainStats.findIndex(a=>a.name==="Total Ram")
	mainStats[totalMEM].data.datasets[0].label="Total Ram"
	mainStats[memusage].data.datasets.push(mainStats[totalMEM].data.datasets[0])
	delete mainStats[totalMEM]
	const filterdMainStats = mainStats.filter(a=>typeof a !== "undefined")
	// console.timeEnd("first")

	// console.time("second")
	// const commands = await runInfluxQuery.runQuery("topCommands")
	// console.log(commands)
	// console.timeEnd("second")

	// console.time("thrid")
	const custom = await runInfluxQuery.runQuery("customCharts")
	console.log(custom)
	// console.timeEnd("thrid")

	// [
	// 	{
	// 		id: timeStamp,
	// 		name: "Command usage over time",
	// 		type: "line",
	// 		data: {
	// 			labels: chartData.flatMap(i => this.formatDate(i.time)),
	// 			datasets: [
	// 				{
	// 					label: "This week",
	// 					data: chartData.flatMap(i => {
	// 						delete i.time;
	// 						return Object.values(i).reduce((a,b) => a + b, 0)
	// 					})
	// 				}
	// 			]
	// 		}
	// 	},
	// 	{
	// 		id: timeStamp,
	// 		name: "Top commands",
	// 		type: "pie",
	// 		data: {
	// 			labels: Object.keys(holder),
	// 			datasets: [
	// 				{
	// 					data: Object.values(holder)
	// 				}
	// 			]
	// 		}
	// 	}
	// ]

	const cards = [
		{
			name: "Guilds",
			value: getLastStat(mainStatsInflux, "guildCount")
		},
		{
			name: "Members",
			value: getLastStat(mainStatsInflux, "members")
		},
		{
			name: "Users",
			value: getLastStat(mainStatsInflux, "userCount")
		}
	]

	return {
		mainStats: {
			stats: filterdMainStats,
			labels
		},
		cards
		// commands,
		// custom,
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
		|> aggregateWindow(every: ${fluxDuration(this.#groupBy ?? "1d")}, fn: mean, createEmpty: false)
		|> yield(name: "mean")`
		// |> map(fn: (r) => ({r with _value: math.round(x: r._value)}))
	
		let tableObjects = []
		for await (const { values, tableMeta } of this.#queryApi.iterateRows(fluxQuery)) {
			tableObjects.push(tableMeta.toObject(values))
		}
		
		return tableObjects
	}
}

const getLastStat = (mainStats, stat) => {
	const relatedStats = mainStats.filter(stats=>stats._field===stat)
	return relatedStats[relatedStats.length-1]._value
}