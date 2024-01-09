import { defineEventHandler, createError, getRouterParams } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

	const userFromDB = await event.context.pgPool`SELECT avatar, aboutme, username, website, public FROM owners WHERE ownerid = ${path.userID}`.catch(() => {})

	if (!userFromDB[0].public && path.userID !== event.context.session.id) throw createError({
		statusCode: 401
	})
	
	return userFromDB[0]
})

export const schema = {
	// querystring: {
	// 	page: { type: "number", default: 0 }
	// },
	responses: {
		401: {
			description: "You do not have permission to access this user"
		},
		200: {
			// type: "array",
			// items: {
			// 	type: "object",
			// 	properties: {
			// 		botid: { type: "string" },
			// 		username: { type: "string" },
			// 		avatar: { type: "string" }
			// 	}
			// }
        }
	}
}
