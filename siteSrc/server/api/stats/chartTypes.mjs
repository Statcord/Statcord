import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async event => {
	if (!a.context.params.id) throw createError({
		statusCode: 404
	})
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${a.context.params.id}`.catch(() => {})
	if (!bot[0]) throw createError({
		statusCode: 404
	})

	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) throw createError({
		statusCode: 401
	})

	return event.context.pgPool`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${a.context.params.id}`.catch(() => {})
})

export const file = "stats/chartTypes.mjs"
export const schema = {
	method: "GET",
	url: "/api/stats/types/:id",
	schema: {
        hide: true,
		path: {
			id: { type: "string" }
		},
        response: {
			404: {},
            401: {},
            200: {
				type: "array",
				contains: { type: "object" }
            }
        }
	}
}
