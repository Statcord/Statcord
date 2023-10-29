import { defineEventHandler, sendNoContent, getQuery } from "h3"

export default defineEventHandler(
    async a => {
        if (!event.context.session.accessToken) return sendNoContent(a, 401)

		return event.context.pgPool`SELECT username, avatar, botid, nsfw FROM bots WHERE ownerid = ${event.context.session.userInfo.id} LIMIT 30 OFFSET 30*${Number(getQuery(a).page ?? 0)}`.catch().catch(() => {})
    }
)
export const file = "bots/mybots.mjs"
export const schema = {
	method: "GET",
	url: "/api/mybots",
	schema: {
        hide: true,
        querystring: {
			page: { type: "number", default: 0 }
        },
        response: {
			401: {},
            200: {
                type: "array",
                items: {
					type: "object",
					properties: {
						botid: { type: "string" },
						username: { type: "string" },
						avatar: { type: "string" }
					}
				}
            }
        }
	}
}
