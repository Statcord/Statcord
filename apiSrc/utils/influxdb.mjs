import {InfluxDB} from '@influxdata/influxdb-client'

export default new InfluxDB({
    url: "",
    timeout: 10 * 1000
})