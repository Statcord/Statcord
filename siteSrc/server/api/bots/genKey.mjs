import { defineEventHandler, createError, readBody } from "h3"
import genKey from "~/utils/genKey.mjs"

export default defineEventHandler(async event => {
	if (!event.context.session.accessToken) throw createError({
		statusCode: 401
	})

	const botID = await readBody(event)
	if (!botID.id) throw createError({
		statusCode: 400
	})

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (!botExisits[0]) throw createError({
		statusCode: 404
	})
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) throw createError({
		statusCode: 401
	})

	const key = genKey()

	event.context.pgPool`UPDATE bots SET token = ${key} WHERE botid = ${botID.id}`.catch(() => {})

	return {key}
})

export const file = "bots/genkey.mjs"
export const schema = {
	method: "POST",
	url: "/api/bots/genKey",
	schema: {
        hide: true,
        body: {
			type: "object",
			properties: {
				id: { type: "string" }
			}
        },
		response: {
            401: {},
            404: {},
			200: {
				type: "object",
				properties: {
					key: { type: "string"}
				}
			}
		}
	}
}
