import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))


	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

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
