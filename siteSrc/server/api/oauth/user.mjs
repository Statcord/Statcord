import { defineEventHandler, sendNoContent } from "h3"

export default defineEventHandler(
    async a => {
        if (!event.context.session.accessToken) return sendNoContent(a, 401)
        return event.context.session.userInfo
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
