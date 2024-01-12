import { defineEventHandler, createError, getRouterParams, readBody, sendError } from "h3"

export default defineEventHandler(async event => {
    const body = await readBody(event)

    const path = getRouterParams(event)

    if (!path.botID) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
    if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
    if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

    if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const bodyKeys = Object.keys(body)
    bodyKeys.includes()

    if (!bodyKeys.includes("public") || !bodyKeys.includes("nsfw")) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))   

    event.context.pgPool`UPDATE bots SET public = ${body.public}, nsfw = ${body.nsfw} WHERE botid = ${path.botID}`.catch(() => {})

    // console.log(body)
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
