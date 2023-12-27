import { defineEventHandler, createError, getRouterParams, readBody } from "h3"

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const path = getRouterParams(event)

    if (!event.context.session.accessToken) throw createError({
        statusCode: 401
    })
    if (event.context.session.id !== path.userID) throw createError({
        statusCode: 401
    })

    if (Object.keys(body).length === 0) return;

    const botExisits = await event.context.pgPool`SELECT ownerid from owners WHERE ownerid = ${path.userID}`.catch(() => {})
    if (!botExisits[0]) throw createError({
        statusCode: 404
    })

    event.context.pgPool`UPDATE owners SET ${event.context.pgPool(body)} WHERE ownerid = ${path.userID}`.catch(() => {})
})

export const schema = {
	method: "POST",
	url: "/api/bots/:id/settings/set",
	schema: {
        hide: true,
        response: {
            400: {},
            401: {},
            404: {},
            200: {}
        }
	}
}
