import { defineEventHandler, readBody, sendNoContent, createError } from "h3"

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

	event.context.pgPool`DELETE FROM chartsettings WHERE botid = ${botID.id}`.catch(() => {})
	event.context.pgPool`DELETE FROM bots WHERE botid = ${botID.id}`.catch(() => {})

	event.context.influx.influxDelete.postDelete({
		org: "disstat",
		bucket:"defaultBucket",
		body: {
			start: new Date(0),
			stop: new Date(),
			// see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
			predicate: `botid="${botID.id}"`,
		}
	})

	sendNoContent(event, 200)
})

export const file = "bots/delete.mjs"
export const schema = {
	method: "DELETE",
	url: "/api/bots/delete",
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
			201: {}
		}
	}
}
