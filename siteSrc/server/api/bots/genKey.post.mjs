import { defineEventHandler, createError, readBody, sendError } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const botID = await readBody(event)
	if (!botID.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const key = event.context.utils.genKey()

	event.context.pgPool`UPDATE bots SET token = ${key} WHERE botid = ${botID.id}`.catch(() => {})

	return {key}
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
		200: {
			// type: "object",
			// properties: {
			// 	key: { type: "string"}
			// }
		}
	}
}
