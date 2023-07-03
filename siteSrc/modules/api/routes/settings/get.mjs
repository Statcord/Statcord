import { eventHandler, sendNoContent, getCookie, readBody } from 'h3'
if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
}

export default eventHandler(
    async (a)=>{
        if (!a.context.params.id) return sendNoContent(a, 404)
        const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null

        if (!session) return sendNoContent(a, 401)

		const botExisits = await db`SELECT ownerid, public from bots WHERE botid = ${a.context.params.id}`.catch(() => {})
		if (!botExisits[0]) return sendNoContent(a, 404)
		if (botExisits[0].ownerid !== session.discordUserInfo.id) return sendNoContent(a, 401)

		const chartSettings = await db`SELECT * from chartsettings WHERE botid = ${a.context.params.id}`.catch(() => {})


        const settings = {
            "Access":{
                "Public": {
                    state: botExisits[0].public,
                    type: "checkbox",
                    enabled: false
                },
                "URL": {
                    state: `/bots/${a.context.params.id}`,
                    type: "text",
                    enabled: false
                }
            },
            "Default charts": {

            },
            "Custom charts": {

            }
        }

        chartSettings.forEach((chart)=>{
            settings['Default charts'][chart.name] = {
                state: chart.enabled,
                type: "checkbox",
                enabled: false
            }
        })

        return settings
    }
)
export const file = "settings/get.mjs"
export const schema = {
	method: 'GET',
	url: '/siteApi/bots/:id/settings/get',
	schema: {
        response: {
            401: {},
            404: {},
            200: {
				type: 'object',
                properties: {
                }
            }
        }
	}
}