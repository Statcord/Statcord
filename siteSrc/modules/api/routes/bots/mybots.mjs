import { eventHandler, sendNoContent, getCookie, getQuery } from 'h3'
if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
}

export default eventHandler(
    async (a)=>{
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (!session?.discordUserInfo.id) return sendNoContent(a, 401)

		return db`SELECT username, avatar, botid, nsfw FROM bots WHERE ownerid = ${session.discordUserInfo.id} LIMIT 30 OFFSET 30*${Number(getQuery(a).page ?? 0)}`.catch().catch(() => {})
    }
)
export const file = "bots/mybots.mjs"
export const schema = {
	method: 'GET',
	url: '/api/mybots',
	schema: {
        hide: true,
        querystring: {
			page: { type: 'number', default: 0 }
        },
        response: {
			401: {},
            200: {
                type: 'array',
                items: {
					type: 'object',
					properties: {
						botid: { type: 'string' },
						username: { type: 'string' },
						avatar: { type: 'string' }
					}
				}
            }
        }
	}
}
