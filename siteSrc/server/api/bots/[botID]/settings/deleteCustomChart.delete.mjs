import { defineEventHandler, getRouterParams, readBody, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const body = await readBody(event)

	event.context.pgPool`DELETE FROM chartsettings WHERE botid = ${path.botID} AND chartid = ${body.chartid}`.catch(() => {})

	event.context.influx.influxDelete.postDelete({
		org: "disstat",
		bucket:"defaultBucket",
		body: {
			start: new Date(0),
			stop: new Date(),
			// see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
			predicate: `botid="${path.botID}" AND customChartID="${body.chartid}"`,
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
