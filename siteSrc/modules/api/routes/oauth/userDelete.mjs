import { eventHandler, sendNoContent, getCookie, deleteCookie } from 'h3'
if (import.meta.env) {
    var {default: redis} = await import('~/utils/redis.mjs')
    var {default: db} = await import('~/utils/postgres.mjs')
	var {influxDelete} = await import('~/utils/influxdb.mjs')
}

export default eventHandler(
    async (a)=>{
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (!session) return sendNoContent(a, 401)
        redis.del(`sess:${sessionID}`)
        deleteCookie(a, "sessionId")

        const myBots = await db`SELECT botid FROM bots WHERE ownerid = ${session.discordUserInfo.id}`.catch(() => {})
        myBots.map(bot => {
            db`DELETE FROM bots WHERE botid = ${bot.botid}`.catch(() => {})

            influxDelete.postDelete({
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

        db`DELETE FROM owners WHERE ownerid = ${session.discordUserInfo.id}`.catch(() => {})

        sendNoContent(a, 200)
    }
)
export const file = "oauth/userDelete.mjs"
export const schema = {
    method: 'DELETE',
    url: '/api/discordOauth/user/delete',
    schema: {
        hide: true,
        body: {},
        response: {
            401: {},
            200: {}
        }
    }
}