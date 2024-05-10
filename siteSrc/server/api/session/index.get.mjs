import { eventHandler, createError, sendError } from 'h3'

export default eventHandler(event => {
	if (!event.context.session) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
	return event.context.session
})

export const schema = {
	hidden: true,
	tags: [
		"Internal"
	],
	responses: {
		200: {
			// type: "object",
			// properties: {
			// 	swagger: { type: "string" },
			// 	info: { type: "object" },
			// 	definitions: { type: "object" },
			// 	paths: { type: "object" }
			// }
		}
	}
}