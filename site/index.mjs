
import fastify from 'fastify'
import routes from './API/routes/apiRoutes.mjs'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'

import redis from './utils/redis.mjs';
import redisStore from './utils/redisSession.mjs';

const API = fastify();
API.register(fastifyCookie);
API.register(fastifySession, {
    secret: "sdafjksa,dsakd.fbnksladfjnslakdfjsalkdfjasl;fds",
    store: new redisStore(redis),
    cookie: {
        path: "/",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
});

await Promise.all(
    routes.map(async endpoint => {
        API.route(endpoint)
    })
)

API.listen({ port: 8090, host: "0.0.0.0" }, (err, address) => {
    console.log(`API live on http://0.0.0.0:8090`)
    if (err) throw err
});