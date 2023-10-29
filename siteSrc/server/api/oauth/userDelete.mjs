import { defineEventHandler, sendNoContent } from "h3"

export default defineEventHandler(
    async a => {
        if (!event.context.session.accessToken) return sendNoContent(a, 401)

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

        sendNoContent(a, 200)
    }
)
export const file = "oauth/userDelete.mjs"
export const schema = {
    method: "DELETE",
    url: "/api/discordOauth/user/delete",
    schema: {
        hide: true,
        body: {},
        response: {
            401: {},
            200: {}
        }
    }
}
