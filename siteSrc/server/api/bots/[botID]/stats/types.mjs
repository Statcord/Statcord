import { defineEventHandler, createError, getRouterParams } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) throw createError({
		statusCode: 404
	})
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) throw createError({
		statusCode: 404
	})

	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) throw createError({
		statusCode: 401
	})

	return event.context.pgPool`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${path.botID}`.catch(() => {})
})

export const schema = {
	tags: [
		"Bot Stats"
	],
	responses: {
		404: {
			description: "Bot not found"
		},
		401: {
			description: "You do not have permission to access this bot"
		},
		200: {
			// type: "array",
			// contains: { type: "object" }
		}
	}
}
