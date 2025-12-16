import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)
	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	
	const bot = await event.context.pgPool`SELECT addedon, bots.username, bots.avatar, nsfw, bots.public, bots.ownerid AS ownerid, owners.username AS ownername, shortdesc, invite FROM bots JOIN owners ON bots.ownerid = owners.ownerid WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const session = await event.context.session(event);
	const isOwner = !!session?.accessToken && bot[0].ownerid === session?.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const links = await event.context.pgPool`SELECT icon, name, url from botlinks WHERE botid = ${path.botID}`.catch(() => {})

	return {...bot[0], isOwner, links}
})

export const schema = {
	"hidden": true
}