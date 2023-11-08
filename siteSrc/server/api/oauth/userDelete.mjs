import { defineEventHandler, sendNoContent, createError } from "h3"

export default defineEventHandler(async event => {
    if (!event.context.session.accessToken) throw createError({
        statusCode: 401
    })

    const myBots = await event.context.pgPool`SELECT botid FROM bots WHERE ownerid = ${event.context.session.userInfo.id}`.catch(() => {})
    myBots.map(bot => {
        event.context.pgPool`DELETE FROM bots WHERE botid = ${bot.botid}`.catch(() => {})

        event.context.influx.influxDelete.postDelete({
            org: "disstat",
            bucket:"defaultBucket",
            body: {
                start: new Date(0),
                stop: new Date(),
                // see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
                predicate: `botid="${bot.botid}"`,
            }
        })
    })

    event.context.pgPool`DELETE FROM owners WHERE ownerid = ${event.context.session.userInfo.id}`.catch(() => {})

    sendNoContent(event, 200)
})

export const schema = {
    method: "DELETE",
    url: "/api/oauth/user/delete",
    schema: {
        hide: true,
        body: {},
        response: {
            401: {},
            200: {}
        }
    }
}
