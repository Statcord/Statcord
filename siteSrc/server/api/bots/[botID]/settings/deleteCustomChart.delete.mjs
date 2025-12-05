import { defineEventHandler, getRouterParams, readBody, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const body = await readBody(event)

	event.context.pgPool`DELETE FROM chartsettings WHERE botid = ${path.botID} AND chartid = ${body.chartid}`.catch(() => {})
	event.context.pgPool`DELETE FROM customcharts WHERE botid = ${path.botID} AND chartid = ${body.chartid}`.catch(() => {})

	sendNoContent(event, 200)
})