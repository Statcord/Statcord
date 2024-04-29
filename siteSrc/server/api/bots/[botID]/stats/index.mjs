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

	const start = new Date(Number(query.start ?? 0)).toISOString()
	const stop = query.end ? new Date(Number(query.end)).toISOString() : new Date().toISOString()

	const runInfluxQuery = new influxRun(
		{
			event,
			start,
			stop,
			// groupBy: "1m",
			groupBy: query.groupBy ?? "1d",
			botID: path.botID
		}
	)

	const returnedData = await runInfluxQuery.getData()
	const data = {
		custom: returnedData[0].value,
		default: returnedData[1].value,
		commands: returnedData[2].value
	}


	// console.time("first")
	// console.timeEnd("first")

	const mainStatsLabels = [...new Set(data.default.map(({_time})=>_time))]
	const commandUsageCounts = data.commands.reduce((acc, curr) => {
		return acc[curr._field] ? ++acc[curr._field] : acc[curr._field] = 1, acc
	}, {});

	const sdafsdf = await event.context.pgPool`SELECT chartid, enabled, name, label, type, category FROM chartsettings WHERE botid = ${path.botID} AND enabled = true`.catch(() => {})
	
	const tempOBJ = {}

	for (const type of sdafsdf){
		if (!tempOBJ[type.category]) tempOBJ[type.category] = []
		switch (type.category){
			case "default": {
				tempOBJ[type.category].push({
					name: type.name,
					type: type.type,
					data: {
						datasets: [
							{
								label: type.label,
								data:  data[type.category].filter(stat=>stat._field===type.chartid).map(({_value})=>_value.toFixed(2))
							}
						]
					}
				})
			}
			break;
			case "custom":{
				tempOBJ[type.category].push({
					name: type.name,
					type: type.type,
					data: {
						datasets: [
							{
								label: type.label,
								data:  data[type.category].filter(stat=>stat.customChartID===type.chartid).map(({_value})=>_value.toFixed(2))
							}
						]
					}
				})
			}
			break;
			case "commands": {
				const chartOBJ = {
					name: type.name,
					type: type.type,
					data: {
						datasets: [
							{
								label: type.label
							}
						]
					}
				}
				if (type.chartid === "cmdTotalUse"){
					const cmdData = data.commands.reduce((acc, cur, i) => {
						const item = i > 0 && acc.find(({_time}) => _time === cur._time)
						if (item) item._value += cur._value;
						else acc.push({ _time: cur._time, _value: cur._value });
						return acc;
					}, [])
					chartOBJ.data.datasets[0].data = cmdData.map(a=>a._value)
					chartOBJ.labels = cmdData.map(i => i._time)
				} else if (type.chartid === "topCmds"){
					chartOBJ.data.labels = Object.keys(commandUsageCounts)
					chartOBJ.data.datasets[0].data = Object.values(commandUsageCounts)
				}
				tempOBJ[type.category].push(chartOBJ)
			}
			break;
		}
	}
	
	if (sdafsdf.filter(t=>t.name.toLowerCase().includes("ram")).length === 2) delete tempOBJ.default[tempOBJ.default.findIndex(a=>a.name==="Total Ram")]

	appendCorsPreflightHeaders(event, {"allowHeaders": "*"})
	return {
		mainStats: {
			stats: tempOBJ.default.filter(a=>a !== void 0),
			labels: mainStatsLabels
		},
		custom: tempOBJ.custom,
		commands: tempOBJ.commands,
		cards: [
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
	}
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