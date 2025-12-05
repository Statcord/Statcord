import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

	const userFromDB = await event.context.pgPool`SELECT plevel, avatar, aboutme, username, website, public FROM owners WHERE ownerid = ${path.userID}`.catch(() => {})
	if (!userFromDB[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'User not found'}))
	if (!userFromDB[0].public && path.userID !== event.context.session?.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	return {
		...userFromDB[0],
		isProfileOwner: path.userID === event.context.session?.userInfo?.id
	}
})

export const schema = {
	"hidden": true
}
