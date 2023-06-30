import { eventHandler, getCookie, readBody, sendNoContent } from 'h3'
if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
	var {getBot} = await import('~/utils/oauth.mjs')
	var {default: genKey} = await import('~/utils/genKey.mjs')
	var {defaultChartSettings} = await import('~/utils/supportedCharts.mjs')
}

export default eventHandler(
    async (a)=>{
		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (!session) return sendNoContent(a, 401)

		const botID = await readBody(a)
		if (!botID.id) return sendNoContent(a, 400)

		const botExisits = await db`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
		if (botExisits[0]) return sendNoContent(a, 404)

		const bot = await getBot(botID.id)
		if (!bot)return sendNoContent(a, 404)

		db`INSERT INTO owners(username, ownerid) VALUES (${session.discordUserInfo.username}, ${session.discordUserInfo.id}) ON CONFLICT (ownerid) DO NOTHING`.catch(() => {})
		db`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon) VALUES (${botID.id}, ${bot.username}, ${bot.avatar}, ${genKey()}, ${session.discordUserInfo.id}, now())`.catch(() => {})

		Object.keys(defaultChartSettings).forEach(chartID => {
			const chart = defaultChartSettings[chartID]
			db`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${botID.id}, ${chartID}, ${chart.name}, ${chart.label}, ${chart.type})`.catch(() => {})
		})

		sendNoContent(a, 200)
})

export const file = "bots/add.mjs"
export const schema = {
	method: 'POST',
	url: '/siteApi/bots/add',
	schema: {
        hide: true,
        body: {
			type: 'object',
			properties: {
				id: { type: 'string' }
			}
        },
		response: {
            401: {},
            400: {},
			200: {}
		}
	}
}
