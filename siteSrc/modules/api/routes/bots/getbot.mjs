import { eventHandler, sendNoContent, getCookie } from 'h3'
if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
}

export default eventHandler(
    async (a)=>{
		if (!a.context.params.id) return sendNoContent(a, 404)
		const bot = await db`SELECT addedon, bots.username, avatar, nsfw, public, bots.ownerid AS ownerid, owners.username AS ownername FROM bots JOIN owners ON bots.ownerid = owners.ownerid WHERE botid = ${a.context.params.id}`.catch(() => {})
		if (!bot[0]) return sendNoContent(a, 404)

		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null
		
		const isOwner = !!session && bot[0].ownerid === session.discordUserInfo.id
		const isPublic = bot[0].public

		if ((!isPublic && !isOwner)) return sendNoContent(a, 401)

		return {...bot[0], isOwner}
    }
)
export const file = "bots/getbot.mjs"
export const schema = {
	method: 'GET',
	url: '/api/bots/:id',
	schema: {
        path: {
			id: { type: 'string' }
        },
        response: {
			404: {},
            401: {},
            200: {
				type: 'object',
				properties: {
					username: { type: 'string' },
					avatar: { type: 'string' },
					ownername: { type: 'string' },
					ownerid: { type: 'string' },
					public: {type: "boolean"},
					isOwner: {type: "boolean"},
					addedon: {type: "string"}
				}
            }
        }
	}
}