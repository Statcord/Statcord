import { defineEventHandler, createError, getRouterParams, readBody } from "h3"

export default defineEventHandler(async event => {
    const body = await readBody(event)

    const path = getRouterParams(event)

    if (!path.botID) throw createError({
        statusCode: 404
    })
    if (!event.context.session.accessToken) throw createError({
        statusCode: 401
    })

    const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
    if (!botExisits[0]) throw createError({
        statusCode: 404
    })
    if (botExisits[0].ownerid !== event.context.session.userInfo.id) throw createError({
        statusCode: 401
    })

    const bodyKeys = Object.keys(body)
    bodyKeys.includes()

    if (!bodyKeys.includes("public") || !bodyKeys.includes("nsfw")) throw createError({
        statusCode: 400
    })     

    event.context.pgPool`UPDATE bots SET public = ${body.public}, nsfw = ${body.nsfw} WHERE botid = ${path.botID}`.catch(() => {})

    // console.log(body)
})

export const schema = {
    hidden: true,
	tags: [
		"Internal"
	],
    responses: {
        400: {
            description: "Bad request"
        },
        401: {
			description: "You do not have permission to access this bot"
		},
        404: {
			description: "Bot not found"
		},
        200: {}
    }
}
