import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)
    // console.log(path)

	// if (!event.context.session.accessToken)
	// return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	return event.context.pgPool`SELECT username, avatar, botid, nsfw FROM bots WHERE ownerid = ${path.userID} LIMIT 30 OFFSET 30*${Number(getQuery(event).page ?? 0)}`.catch().catch(() => {})
})

export const schema = {
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
