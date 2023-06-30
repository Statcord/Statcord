import { eventHandler, sendNoContent, getCookie, deleteCookie } from 'h3'
if (import.meta.env) {
    var {default: redis} = await import('~/utils/redis.mjs')
}

export default eventHandler(
    async (a)=>{
		
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null
		
        if (session){
			redis.del(`sess:${sessionID}`)
			deleteCookie(a, "sessionId")
		}

		sendNoContent(a, 200)
    }
)
export const file = "oauth/logout.mjs"
export const schema = {
	method: 'GET',
	url: '/siteApi/discordOauth/logout',
	schema: {
		hide: true,
        response: {
        }
	}
}