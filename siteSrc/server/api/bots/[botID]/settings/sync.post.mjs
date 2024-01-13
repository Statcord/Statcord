import { defineEventHandler, getRouterParams, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const bot = await event.context.oauth.rest.users.get(path.botID)
	if (!bot) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	event.context.pgPool`UPDATE bots SET username = ${bot.username}, avatar = ${bot.avatar} WHERE botid = ${path.botID}`.catch(() => {})

	return {success: true, message: "The bot has been synced!"}
})

export const schema = {
	// body: {
	// 	type: "object",
	// 	properties: {
	// 		id: { type: "string" }
	// 	}
	// },
	hidden: true,
	tags: [
		"Internal"
	],
	responses: {
		401: {
			description: "You do not have permission to access this bot"
		},
		404: {
			description: "Bot not found"
		},
		400: {
            description: "Bad request"
        },
		200: {
			// type: "object",
			// properties: {
			// 	success: { type: "boolean", default: true },
			// 	message: { type: "string", default: "The bot has been synced!" }
			// }
		}
	}
}
