import { defineEventHandler, readBody, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	const session = await event.context.session(event);
	if (!session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const botID = await readBody(event)
	if (!botID.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	await event.context.pgPool`DELETE FROM chartsettings WHERE botid = ${botID.id}`.catch(() => {})
	await event.context.pgPool`DELETE FROM bots WHERE botid = ${botID.id}`.catch(() => {})
	await event.context.pgPool`DELETE FROM mainstats WHERE botid = ${botID.id}`.catch(() => {})
	await event.context.pgPool`DELETE FROM customcharts WHERE botid = ${botID.id}`.catch(() => {})
	await event.context.pgPool`DELETE FROM commandsrun WHERE botid = ${botID.id}`.catch(() => {})

	sendNoContent(event, 200)
})

export const schema = {
	"hidden": true
}
