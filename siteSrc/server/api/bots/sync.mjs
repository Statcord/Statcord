import { defineEventHandler, sendNoContent, getCookie, readBody } from "h3"
import db from '~/utils/postgres.mjs'
import redis from "~/utils/redis.mjs"
if (import.meta.env) {
	var {getBot} = await import("~/utils/oauth.mjs")
}

export default defineEventHandler(
    async a => {
		const botID = await readBody(a)
		if (!botID.id) return sendNoContent(a, 400)

		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (!session?.discordUserInfo.id) return sendNoContent(a, 401)

		const botExisits = await db`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
		if (!botExisits[0]) return sendNoContent(a, 404)
		if (botExisits[0].ownerid !== session.discordUserInfo.id) return sendNoContent(a, 401)

		const bot = await getBot(botID.id)
		if (!bot) return sendNoContent(a, 404)

		db`UPDATE bots SET username = ${bot.username}, avatar = ${bot.avatar} WHERE botid = ${botID.id}`.catch(() => {})

		return {success: true, message: "The bot has been synced!"}
    }
)
export const file = "bots/sync.mjs"
export const schema = {
	method: "POST",
	url: "/api/bots/sync",
	schema: {
		body: {
			type: "object",
			properties: {
				id: { type: "string" }
			}
		},
		response: {
			401: {},
			404: {},
			400: {},
			200: {
				type: "object",
				properties: {
					success: { type: "boolean", default: true },
					message: { type: "string", default: "The bot has been synced!" }
				}
			}
		}
	}
}

