import { eventHandler, sendNoContent, getCookie } from 'h3'
if (import.meta.env) {
    var {default: redis} = await import('~/utils/redis.mjs')
}

export default eventHandler(
    async (a)=>{
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (session) return session.discordUserInfo
        else sendNoContent(a, 401)
    }
)
export const file = "oauth/user.mjs"
export const schema = {
	method: 'GET',
	url: '/siteApi/discordOauth/user',
	schema: {
        response: {
            401: {},
            200: {
				type: 'object',
                properties: {
                    id: { type: 'string' },
                    username: { type: 'string' },
                    avatar: { type: 'string' },
                    discriminator: { type: 'string' },
                    locale: { type: 'string' }
                }
            }
        }
	}
}