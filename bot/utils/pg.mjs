import postgres from "postgres";
import config from '../config/settings.mjs'

export default postgres({
    ...config.postgres,
    types: {
        // bigint: postgres.BigInt,
        rect: {
            to: 1700,
            from: [1700],
            serialize: x => '' + x,
            parse: parseFloat
        }
    },
    // debug: function(connection, query, params, types){
        // console.log(connection)
    //     console.log(query)
    //     console.log(params)
    // }
})
