import { defineEventHandler, readBody, sendNoContent, createError } from "h3"

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

	const bot = await event.context.oauth.rest.users.get(botID.id)
	if (!bot) throw createError({
		statusCode: 404
	})

	event.context.pgPool`INSERT INTO owners(username, ownerid) VALUES (${event.context.session.userInfo.username}, ${event.context.session.userInfo.id}) ON CONFLICT (ownerid) DO NOTHING`.catch(() => {})
	event.context.pgPool`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon) VALUES (${botID.id}, ${bot.username}, ${bot.avatar}, ${event.context.utils.genKey()}, ${event.context.session.userInfo.id}, now())`.catch(() => {})

	Object.keys(event.context.utils.defaultChartSettings).forEach(chartID => {
		const chart = event.context.utils.defaultChartSettings[chartID]
		event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${botID.id}, ${chartID}, ${chart.name}, ${chart.label}, ${chart.type})`.catch(() => {})
	})

	sendNoContent(event, 200)
})

export const schema = {
	// body: {
	// 	type: "object",
	// 	properties: {
	// 		id: { type: "string" }
	// 	}
	// },
	responses: {
		401: {
			description: "You do not have permission to access this bot"
		},
		400: {
            description: "Bad request"
        },
		200: {}
	}
}
