import { defineEventHandler, sendNoContent, readBody } from "h3"
import genKey from "~/utils/genKey.mjs"

export default defineEventHandler(
    async a => {
        if (!event.context.session.accessToken) return sendNoContent(a, 401)

		const botID = await readBody(a)
		if (!botID.id) return sendNoContent(a, 400)

		const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
		if (!botExisits[0]) return sendNoContent(a, 404)
		if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendNoContent(a, 401)

		const key = genKey()

		event.context.pgPool`UPDATE bots SET token = ${key} WHERE botid = ${botID.id}`.catch(() => {})
		return {key}
    }
)
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
