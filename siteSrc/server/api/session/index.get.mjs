import { eventHandler, createError, sendError } from 'h3'

export default eventHandler(async event => {
	const session = await event.context.session(event);
	if (!session) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
	return session
})