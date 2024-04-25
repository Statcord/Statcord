import { defineEventHandler, readBody, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const botID = await readBody(event)
	if (!botID.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${botID.id}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

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

export const schema = {
	"hidden": true,
	"tags": [
		"Internal"
	],
	// body: {
	// 	type: "object",
	// 	properties: {
	// 		id: { type: "string" }
	// 	}
	// },
	responses: {
		401: {
			description: "You do not have permission to access this bot"
		},
		404: {
			description: "Bot not found"
		},
		201: {}
	}
}
