import { InfluxDB, flux, fluxDuration } from '@influxdata/influxdb-client'
import { DeleteAPI } from '@influxdata/influxdb-client-apis'

const {configFile} = useRuntimeConfig()

const influx = new InfluxDB(configFile.influx)
const deleteAPI = new DeleteAPI(influx)

const influxRun = class{
	#queryApi
	#botID
	#start
	#end
	#groupBy
	constructor(options) {
		this.#queryApi = influx.getQueryApi("disstat")
		this.#botID = options.botID
	}
	async runQuery(measurement) {
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
	async getData() {
		return Promise.allSettled([
			this.runQuery("customCharts"),
			this.runQuery("botStats"),
			this.runQuery("topCommands")
		])
	}
    formatTime(t) {
        const range = t[t.length-1].toLowerCase();
        const value = range == 'e' ? 1 : Number(t.match(/\d+/)[0]);

        const now = new Date();
        const end = new Date();
        switch (range){
            case "e":{
                end.setTime(0)
                this.#start = end.toISOString()
                this.#end = now.toISOString()
                this.#groupBy = "1d"
                break;
            }
            case "h":{
                end.setTime(now.getTime()-((60*60*1000) * value))
                this.#start = end.toISOString()
                this.#end = now.toISOString()

                this.#groupBy = "1h"
                break;
            }
            case "d":{
                end.setTime(now.getTime()-((24*60*60*1000) * value))
                this.#start = end.toISOString()
                this.#end = now.toISOString()

                this.#groupBy = "1d"
                break;
            }
            case "o":{
                end.setTime(now.getTime()-((30*24*60*60*1000) * value))
                this.#start = end.toISOString()
                this.#end = now.toISOString()

                this.#groupBy = "1d"
                break;
            }
            case "y":{
                end.setTime(now.getTime()-((12*30*24*60*60*1000) * value))
                this.#start = end.toISOString()
                this.#end = now.toISOString()

                    this.#groupBy = "1d"
                break;
            }
            default: {
                console.log(value)
                console.log(range)
            }
        }
    }
}

export default defineEventHandler((event) => {
    event.context.influx = {
        influxRun,
        influxClient: influx,
        influxDelete: deleteAPI
    }
})