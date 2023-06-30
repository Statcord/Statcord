import { InfluxDB } from '@influxdata/influxdb-client'
import {DeleteAPI} from '@influxdata/influxdb-client-apis'
import { influxConfig } from '../config.mjs'

const influx = new InfluxDB(influxConfig)
const deleteAPI = new DeleteAPI(influx)

export const influxClient = influx
export const influxDelete = deleteAPI