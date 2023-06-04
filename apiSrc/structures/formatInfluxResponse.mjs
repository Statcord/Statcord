export default class {
    #influxResponse
    constructor(influxResponse) {
        this.#influxResponse = influxResponse.groupRows[0]?.rows
    }
    getResponse() {
        return this.#influxResponse?.map(row => {
            delete row.botid;
            row.time=row.time._nanoISO;
            return row;
        })

    }
}
