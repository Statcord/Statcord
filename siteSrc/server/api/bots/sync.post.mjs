import { defineEventHandler, readBody, createError } from "h3"

export default defineEventHandler(async event => {
	const botID = await readBody(event)
	if (!botID.id) throw createError({
		statusCode: 400
	})

	if (!event.context.session.accessToken) throw createError({
		statusCode: 401
	})

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (!botExisits[0]) throw createError({
		statusCode: 404
	})
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) throw createError({
		statusCode: 401
	})

	const bot = await event.context.oauth.rest.users.get(botID.id)
	if (!bot) throw createError({
		statusCode: 404
	})

	event.context.pgPool`UPDATE bots SET username = ${bot.username}, avatar = ${bot.avatar} WHERE botid = ${botID.id}`.catch(() => {})

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
