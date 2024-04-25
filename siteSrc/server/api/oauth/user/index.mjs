import { defineEventHandler, createError, sendError } from "h3"

export default defineEventHandler(async event => {
    if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    return event.context.session.userInfo
})

export const schema = {
    "hidden": true,
	"tags": [
		"Internal"
	],
    responses: {
        401: {
			description: "You do not have permission to access this user"
		},
        200: {
            // type: "object",
            // properties: {
            //     id: { type: "string" },
            //     username: { type: "string" },
            //     avatar: { type: "string" },
            //     discriminator: { type: "string" },
            //     locale: { type: "string" }
            // }
        }
    }
}
