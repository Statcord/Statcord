import { eventHandler, createError, sendError } from 'h3'

export default eventHandler(event => {
	if (!event.context.session) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
	return event.context.session
})