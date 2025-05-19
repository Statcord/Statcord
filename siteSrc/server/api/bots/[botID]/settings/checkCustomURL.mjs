import { defineEventHandler, getRouterParams, readBody, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const path = getRouterParams(event)
	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const owner = await event.context.pgPool`SELECT plevel FROM owners WHERE ownerid = ${event.context.session.userInfo.id}`.catch(() => {})
    if (owner[0].plevel === 0) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
    
    const body = readBody(event)

    console.log(body)


	// sendNoContent(event, 200)
    return sendError(event, createError({statusCode: 501, statusMessage: 'Not Implemented'}))
})

export const schema = {
	"hidden": true,
	"tags": [
		"Internal"
	],
	responses: {
		401: {
			description: "You do not have permission to access this bot"
		},
		404: {
			description: "Bot not found"
		},
		201: {}
	}
}
