import { eventHandler, sendNoContent, getCookie, readBody } from 'h3'
if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
	var {default: genKey} = await import('~/utils/genKey.mjs')
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

		const key = genKey()

		db`UPDATE bots SET token = ${key} WHERE botid = ${botID.id}`.catch(() => {})
		return {key}
    }
)
export const file = "bots/genkey.mjs"
export const schema = {
	method: 'POST',
	url: '/api/bots/genKey',
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
			200: {
				type: 'object',
				properties: {
					key: { type: 'string'}
				}
			}
		}
	}
}