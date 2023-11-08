import { defineEventHandler, readBody, sendNoContent, createError } from "h3"
if (import.meta.env) {
	var {defaultChartSettings} = await import("~/utils/supportedCharts.mjs")
}
import genKey from "~/utils/genKey.mjs"

export default defineEventHandler(async event => {
	if (!event.context.session.accessToken) throw createError({
		statusCode: 401
	})

	const botID = await readBody(event)
	if (!botID.id) throw createError({
		statusCode: 400
	})

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (botExisits[0]) throw createError({
		statusCode: 404
	})

	const bot = await event.context.oauth.getBot(botID.id)
	if (!bot) throw createError({
		statusCode: 404
	})

	event.context.pgPool`INSERT INTO owners(username, ownerid) VALUES (${event.context.session.userInfo.username}, ${event.context.session.userInfo.id}) ON CONFLICT (ownerid) DO NOTHING`.catch(() => {})
	event.context.pgPool`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon) VALUES (${botID.id}, ${bot.username}, ${bot.avatar}, ${genKey()}, ${event.context.session.userInfo.id}, now())`.catch(() => {})

	Object.keys(defaultChartSettings).forEach(chartID => {
		const chart = defaultChartSettings[chartID]
		event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${botID.id}, ${chartID}, ${chart.name}, ${chart.label}, ${chart.type})`.catch(() => {})
	})

	sendNoContent(event, 200)
})

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
