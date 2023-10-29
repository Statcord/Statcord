import { defineEventHandler, sendNoContent, getCookie, deleteCookie } from "h3"

export default defineEventHandler(
    async a => {
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await event.context.redis.get(`sess:${sessionID}`)) : null

        if (session){
			event.context.redis.del(`sess:${sessionID}`)
			deleteCookie(a, "sessionId")
		}

		sendNoContent(a, 200)
    }
)
export const file = "oauth/logout.mjs"
export const schema = {
	method: "GET",
	url: "/api/discordOauth/logout",
	schema: {
		hide: true,
        response: {
			200: {}
        }
	}
}
