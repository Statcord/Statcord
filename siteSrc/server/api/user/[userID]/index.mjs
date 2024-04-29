import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

	const userFromDB = await event.context.pgPool`SELECT plevel, avatar, aboutme, username, website, public FROM owners WHERE ownerid = ${path.userID}`.catch(() => {})

	if (!userFromDB[0].public && path.userID !== event.context.session?.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	return {
		...userFromDB[0],
		isProfileOwner: path.userID === event.context.session?.userInfo?.id
	}
})

export const schema = {
	parameters: [
		{
		  name: 'userID',
		  in: 'path',
		  required: true,
		  content: { media: 'application/json' }
		}
	],
	// querystring: {
	// 	page: { type: "number", default: 0 }
	// },
	"hidden": true,
	"tags": [
		"Internal"
	],
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
