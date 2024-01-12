import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

    if (!path.botID) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

    if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const botExisits = await event.context.pgPool`SELECT ownerid, public, nsfw from bots WHERE botid = ${path.botID}`.catch(() => {})
    if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
    if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const chartSettings = await event.context.pgPool`SELECT * from chartsettings WHERE botid = ${path.botID}`.catch(() => {})

    const settings = [
        {
            state: botExisits[0].public,
            type: "checkbox",
            enabled: true,
            catagory: "Access",
            name: "Public",
            id: "public"
        },
        {
            state: botExisits[0].nsfw,
            type: "checkbox",
            enabled: true,
            catagory: "Access",
            name: "NSFW",
            id: "nsfw"
        },
        {
            state: `/bots/${path.botID}`,
            type: "text",
            enabled: false,
            catagory: "Access",
            name: "URL",
            id: "customurl"
        },
    ]

    // chartSettings.forEach(chart => {
    //     settings.push({
    //         state: chart.enabled,
    //         type: "checkbox",
    //         enabled: false,
    //         catagory: "Default charts",
    //         name: chart.name
    //     })
    // })

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
