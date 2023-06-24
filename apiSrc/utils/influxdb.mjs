import { InfluxDB } from '@influxdata/influxdb-client'
import {DeleteAPI} from '@influxdata/influxdb-client-apis'

const { influxConfig } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../config/config.mjs')

const influx = new InfluxDB(influxConfig)
const deleteAPI = new DeleteAPI(influx)

export const influxClient = influx
export const influxDelete = deleteAPI