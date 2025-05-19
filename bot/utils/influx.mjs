import { flux, fluxDuration, InfluxDB } from "@influxdata/influxdb-client"
import configFile from '../config/settings.mjs'
const influx = new InfluxDB(configFile.influx)

export default class{
	#queryApi
	#botID
	constructor(botID){
		this.#queryApi = influx.getQueryApi("disstat")
		this.#botID = botID
	}
	async runQuery(measurement){
		const fluxQuery = flux`import "experimental/date/boundaries"
		day = boundaries.yesterday()
		from(bucket:"defaultBucket")		
		|> range(start: day.start, stop: today())
		|> filter(fn: (r) => r["botid"] == ${this.#botID})
		|> filter(fn: (r) => r._measurement == ${measurement})
		|> aggregateWindow(every: ${fluxDuration('1d')}, fn: mean, createEmpty: false)
		|> yield(name: "mean")`

		const tableObjects = []
		for await (const { values, tableMeta } of this.#queryApi.iterateRows(fluxQuery)) {
			tableObjects.push(tableMeta.toObject(values))
		}
		
		return tableObjects
	}
	async getData (){
		return Promise.allSettled([
			// this.runQuery("customCharts"),
			this.runQuery("botStats"),
			// this.runQuery("topCommands")
		])
	}
}