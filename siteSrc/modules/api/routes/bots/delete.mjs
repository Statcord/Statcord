import { eventHandler, readBody, sendNoContent, getCookie } from 'h3'
if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
	var {influxDelete} = await import('~/utils/influxdb.mjs')
}

export default eventHandler(
    async (a)=>{
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (!session) return sendNoContent(a, 401)

		const botID = await readBody(a)
		if (!botID.id) return sendNoContent(a, 400)

		const botExisits = await db`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
		if (!botExisits[0]) return sendNoContent(a, 404)
		if (botExisits[0].ownerid !== session.discordUserInfo.id) return sendNoContent(a, 401)

		db`DELETE FROM chartsettings WHERE botid = ${botID.id}`.catch(() => {})
		db`DELETE FROM bots WHERE botid = ${botID.id}`.catch(() => {})

		influxDelete.postDelete({
			org: "disstat",
			bucket:"defaultBucket",
			body: {
				start: new Date(0),
				stop: new Date(),
				// see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
				predicate: `botid="${botID.id}"`,
			}
		})

		sendNoContent(a, 200)
    }
)
export const file = "bots/delete.mjs"
export const schema = {
	method: 'DELETE',
	url: '/siteApi/bots/delete',
	schema: {
        hide: true,
        body: {
			type: 'object',
			properties: {
				id: { type: 'string' }
			}
        },
		response: {
            401: {},
            404: {},
			201: {}
		}
	}
}