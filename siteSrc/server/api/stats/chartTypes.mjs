import { defineEventHandler, sendNoContent, getCookie } from "h3"

export default defineEventHandler(
    async a => {
		if (!a.context.params.id) return sendNoContent(a, 404)
		const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${a.context.params.id}`.catch(() => {})
		if (!bot[0]) return sendNoContent(a, 404)

		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await event.context.redis.get(`sess:${sessionID}`)) : null

		const isOwner = !!session && bot[0].ownerid === session.discordUserInfo.id
		const isPublic = bot[0].public

		if ((!isPublic && !isOwner)) return sendNoContent(a, 401)

		return event.context.pgPool`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${a.context.params.id}`.catch(() => {})
    }
)
export const file = "stats/chartTypes.mjs"
export const schema = {
	method: "GET",
	url: "/api/stats/types/:id",
	schema: {
        hide: true,
		path: {
			id: { type: "string" }
		},
        response: {
			404: {},
            401: {},
            200: {
				type: "array",
				contains: { type: "object" }
            }
        }
	}
}
