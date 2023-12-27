import { defineEventHandler, createError, getRouterParams } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

	const userFromDB = await event.context.pgPool`SELECT aboutme, username, website, public FROM owners WHERE ownerid = ${path.userID}`.catch(() => {})

	if (!userFromDB[0].public && path.userID !== event.context.session.id) throw createError({
		statusCode: 401
	})

	return userFromDB[0]
})

export const schema = {
	method: "GET",
	url: "/api/bots/mybots",
	schema: {
        hide: true,
        querystring: {
			page: { type: "number", default: 0 }
        },
        response: {
			401: {},
            200: {
                type: "array",
                items: {
					type: "object",
					properties: {
						botid: { type: "string" },
						username: { type: "string" },
						avatar: { type: "string" }
					}
				}
            }
        }
	}
}
