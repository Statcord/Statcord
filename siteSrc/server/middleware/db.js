import postgres from 'postgres'
import { Postgrelogin } from '../../static/settings.mjs'

const pgPool = postgres(
    {
        ...Postgrelogin,
        types: {
            // bigint: postgres.BigInt,
            rect: {
                to        : 1700,
                from      : [1700],
                serialize : x => '' + x,
                parse     : parseFloat
            }
        },
        // debug: function(connection, query, params, types){
        //     console.log(query)
        //     console.log(params)
        // }
    }
)

export default defineEventHandler((event) => {
    event.context.pgPool` = pgPool
})