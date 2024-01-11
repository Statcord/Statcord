import { defineEventHandler, createError, getRouterParams, readBody } from "h3"

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const path = getRouterParams(event)

    if (!event.context.session.accessToken) throw createError({
        statusCode: 401
    })

    // console.log("1")
    if (event.context.session.userInfo.id !== path.userID) throw createError({
        statusCode: 401
    })

    // console.log("2")


    if (Object.keys(body).length === 0) return;

    // console.log("3")

    const botExisits = await event.context.pgPool`SELECT ownerid from owners WHERE ownerid = ${path.userID}`.catch(() => {})
    if (!botExisits[0]) throw createError({
        statusCode: 404
    })

    event.context.pgPool`UPDATE owners SET ${event.context.pgPool(body)} WHERE ownerid = ${path.userID}`.catch(() => {})
})

export const schema = {
    hidden: true,
	tags: [
		"Internal"
	],
    responses: {
        400: {
            description: "Bad request"
        },
		404: {
			description: "Bot not found"
		},
		401: {
			description: "Not authorised"
		},
        200: {}
	}
}
