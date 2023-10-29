import { InfluxDB } from '@influxdata/influxdb-client'
import { DeleteAPI } from '@influxdata/influxdb-client-apis'

const influx = new InfluxDB({
    url: 'http://192.168.0.23:8086',
    token: process.env.influxToken
})
const deleteAPI = new DeleteAPI(influx)

export default defineEventHandler((event) => {    
    event.context.influx = {
        influxClient: influx,
        influxDelete: deleteAPI
    }
})