import { defineEventHandler, sendNoContent } from "h3"

export default defineEventHandler(
    async a => {
        if (!a.context.params.id) return sendNoContent(a, 404)
        if (!event.context.session.accessToken) return sendNoContent(a, 401)

		const botExisits = await event.context.pgPool`SELECT ownerid, public, nsfw from bots WHERE botid = ${a.context.params.id}`.catch(() => {})
		if (!botExisits[0]) return sendNoContent(a, 404)
		if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendNoContent(a, 401)

		const chartSettings = await event.context.pgPool`SELECT * from chartsettings WHERE botid = ${a.context.params.id}`.catch(() => {})

        const settings = {
            "Access": {
                "Public": {
                    state: botExisits[0].public,
                    type: "checkbox",
                    enabled: false
                },
                "NSFW": {
                    state: botExisits[0].nsfw,
                    type: "checkbox",
                    enabled: false
                },
                "URL": {
                    state: `/bots/${a.context.params.id}`,
                    type: "text",
                    enabled: false
                },
            },
            "Default charts": {

            },
            "Custom charts": {

            }
        }

        chartSettings.forEach(chart => {
            settings["Default charts"][chart.name] = {
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
	method: "GET",
	url: "/api/bots/:id/settings/get",
	schema: {
        hide: true,
        response: {
            401: {},
            404: {},
            200: {
				type: "object",
                properties: {
                }
            }
        }
	}
}
