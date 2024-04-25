import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

    if (!path.botID) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

    if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const botExisits = await event.context.pgPool`SELECT * from bots WHERE botid = ${path.botID}`.catch(() => {})
    if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
    if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const settings = {
        mainSettings: {
            "public": botExisits[0].public,
            "nsfw": botExisits[0].nsfw,
            "shortdesc": botExisits[0].shortdesc,
            "longdesc": botExisits[0].longdesc
        },
        links: Object.assign({}, ...(await event.context.pgPool`SELECT name, url from botlinks WHERE botid = ${path.botID}`.catch(() => {})).map(l=>{return {[l.name]: l.url}}))
    }
    
    const chartSettings = await event.context.pgPool`SELECT chartid, enabled, name, label, type, category from chartsettings WHERE botid = ${path.botID}`.catch(() => {})
    chartSettings.forEach(setting => {
        if (!settings[setting.category]) settings[setting.category] = []
        settings[setting.category].push(setting)
    });

    return settings
})

export const schema = {
    hidden: true,
	tags: [
		"Internal"
	],
    parameters: [
		{
			name: 'botID',
			in: 'path',
			required: true,
			content: { media: 'application/json' }
		}
    ],
    responses: {
        401: {
			description: "You do not have permission to access this bot"
		},
        404: {
			description: "Bot not found"
		},
        200: {}
    }
}
