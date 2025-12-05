import { defineEventHandler, createError, getRouterParams, sendError } from "h3"
import genKey from "~/server/utils/genKey.mjs"

export default defineEventHandler(async event => {
	if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const key = genKey()

	event.context.pgPool`UPDATE bots SET token = ${key} WHERE botid = ${path.botID}`.catch(() => {})

	return {key}
})