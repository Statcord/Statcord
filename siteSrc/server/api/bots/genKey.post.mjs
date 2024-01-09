import { defineEventHandler, createError, readBody } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session.accessToken) throw createError({
		statusCode: 401
	})

	const botID = await readBody(event)
	if (!botID.id) throw createError({
		statusCode: 400
	})

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (!botExisits[0]) throw createError({
		statusCode: 404
	})
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) throw createError({
		statusCode: 401
	})

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
