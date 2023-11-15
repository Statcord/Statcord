import { defineEventHandler, createError, getRouterParams } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

    if (!path.botID) throw createError({
        statusCode: 404
    })
    if (!event.context.session.accessToken) throw createError({
        statusCode: 401
    })

    const botExisits = await event.context.pgPool`SELECT ownerid, public, nsfw from bots WHERE botid = ${path.botID}`.catch(() => {})
    if (!botExisits[0]) throw createError({
        statusCode: 404
    })
    if (botExisits[0].ownerid !== event.context.session.userInfo.id) throw createError({
        statusCode: 401
    })

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
