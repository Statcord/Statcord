import { defineEventHandler, sendNoContent, getCookie } from "h3"

export default defineEventHandler(
    async a => {
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await event.context.redis.get(`sess:${sessionID}`)) : null

        if (session) return session.discordUserInfo
        sendNoContent(a, 401)
    }
)
export const file = "oauth/user.mjs"
export const schema = {
	method: "GET",
	url: "/api/discordOauth/user",
	schema: {
        response: {
            401: {},
            200: {
				type: "object",
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                    avatar: { type: "string" },
                    discriminator: { type: "string" },
                    locale: { type: "string" }
                }
            }
        }
	}
}
