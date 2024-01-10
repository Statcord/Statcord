import { InfluxDB } from '@influxdata/influxdb-client'
import { DeleteAPI } from '@influxdata/influxdb-client-apis'

const {configFile} = useRuntimeConfig()

const influx = new InfluxDB(configFile.influx)
const deleteAPI = new DeleteAPI(influx)

export default defineEventHandler((event) => {    
    event.context.influx = {
        influxClient: influx,
        influxDelete: deleteAPI
    }
})