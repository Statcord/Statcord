import { defineEventHandler, createError, getRouterParams, sendError } from 'h3'
import { flux, fluxDuration } from '@influxdata/influxdb-client'

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT * FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const runInfluxQuery = new influxRun({
		event,
		start: 0,
		stop: new Date().toISOString(),
		groupBy: "1d",
		botID: path.botID
	})
	const returnedData = await runInfluxQuery.getData()

	const ownerInfo = await event.context.pgPool`SELECT * FROM owners WHERE ownerid = ${bot[0].ownerid}`.catch(() => {})
	const chartSettings = await event.context.pgPool`SELECT * FROM chartsettings WHERE botid = ${path.botID}`.catch(() => {})

	const outOBj = {
		botInfo: bot[0],
		ownerInfo: ownerInfo[0],
		chartSettings,
		botStats:{
			custom: returnedData[0].value,
			mainStats: returnedData[1].value,
			commands: returnedData[2].value
		}
	}

	return Buffer.from(JSON.stringify(outOBj)).toString('base64')
})
export const schema = {
	// querystring: {
	// },
	"hidden": true,
	"tags": [
		"Internal"
	],
	responses: {
		404: {
			description: "Bot not found"
		},
		401: {
			description: "Not authorised"
		},
		200: {
			// type: 'object',
			// properties: {
			// 	mainStats: {
			// 		type: "array",
			// 		items: {
			// 			type: 'object',
			// 			properties: {
			// 				time: { type: 'string' },
			// 				type: { type: 'number' },
			// 				cpuUsage: { type: 'number' },
			// 				guildCount: { type: 'number' },
			// 				members: { type: 'number' },
			// 				ramUsage: { type: 'number' },
			// 				shardCount: { type: 'number' },
			// 				totalRam: { type: 'number' },
			// 				userCount: { type: 'number' },
			// 			}
			// 		}
			// 	},
			// 	commands: {
			// 		type: "array",
			// 		contains: { type: "object" }
			// 	},
			// 	custom: {
			// 		type: "array",
			// 		contains: { type: "object" }
			// 	}
			// }
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
	async getData (){
		return Promise.allSettled([
			this.runQuery("customCharts"),
			this.runQuery("botStats"),
			this.runQuery("topCommands")
		])
	}
}