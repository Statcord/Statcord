import { flux, fluxDuration, InfluxDB } from "@influxdata/influxdb-client"
import configFile from '../config/settings.mjs'
const influx = new InfluxDB(configFile.influx)

export default class{
	#queryApi
	#botID
	#start
	#end
	#groupBy
	constructor(options){
		this.#queryApi = influx.getQueryApi("disstat")
		this.#botID = options.botID
		this.#start = options.start
		this.#end = options.stop
		this.#groupBy = options.groupBy
	}
	async runQuery(measurement){
		const fluxQuery = this.determineQuery(measurement)

		const tableObjects = []
		for await (const { values, tableMeta } of this.#queryApi.iterateRows(fluxQuery)) {
			tableObjects.push(tableMeta.toObject(values))
		}
		
		return tableObjects
	}
	determineQuery(measurement){
		if (this.#groupBy) return flux`from(bucket:"defaultBucket")
		|> range(start: time(v: ${this.#start}), stop: time(v: ${this.#end}))
		|> filter(fn: (r) => r._measurement == ${measurement})
		|> filter(fn: (r) => r["botid"] == ${this.#botID})
		|> aggregateWindow(every: ${fluxDuration(this.#groupBy)}, fn: mean, createEmpty: false)
		|> yield(name: "mean")`

		return flux`import "experimental/date/boundaries"
		day = boundaries.yesterday()
		from(bucket:"defaultBucket")		
		|> range(start: day.start, stop: today())
		|> filter(fn: (r) => r["botid"] == ${this.#botID})
		|> filter(fn: (r) => r._measurement == ${measurement})
		|> aggregateWindow(every: ${fluxDuration('1d')}, fn: mean, createEmpty: false)
		|> yield(name: "mean")`
	}
	async getData (){
		return Promise.allSettled([
			// this.runQuery("customCharts"),
			this.runQuery("botStats"),
			// this.runQuery("topCommands")
		])
	}
}