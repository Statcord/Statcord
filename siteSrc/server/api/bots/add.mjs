import { defineEventHandler, getCookie, readBody, sendNoContent } from "h3"
if (import.meta.env) {
	var {defaultChartSettings} = await import("~/utils/supportedCharts.mjs")
}
import genKey from "~/utils/genKey.mjs"

export default defineEventHandler(
    async a => {
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await event.context.redis.get(`sess:${sessionID}`)) : null

        if (!session) return sendNoContent(a, 401)

		const botID = await readBody(a)
		if (!botID.id) return sendNoContent(a, 400)

		const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
		if (botExisits[0]) return sendNoContent(a, 404)

		const bot = await event.context.oauth.getBot(botID.id)
		if (!bot) return sendNoContent(a, 404)

		event.context.pgPool`INSERT INTO owners(username, ownerid) VALUES (${session.discordUserInfo.username}, ${session.discordUserInfo.id}) ON CONFLICT (ownerid) DO NOTHING`.catch(() => {})
		event.context.pgPool`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon) VALUES (${botID.id}, ${bot.username}, ${bot.avatar}, ${genKey()}, ${session.discordUserInfo.id}, now())`.catch(() => {})

		Object.keys(defaultChartSettings).forEach(chartID => {
			const chart = defaultChartSettings[chartID]
			event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${botID.id}, ${chartID}, ${chart.name}, ${chart.label}, ${chart.type})`.catch(() => {})
		})

		sendNoContent(a, 200)
	}
)

export const file = "bots/add.mjs"
export const schema = {
	method: "POST",
	url: "/api/bots/add",
	schema: {
        hide: true,
        body: {
			type: "object",
			properties: {
				id: { type: "string" }
			}
        },
		response: {
            401: {},
            400: {},
			200: {}
		}
	}
}
