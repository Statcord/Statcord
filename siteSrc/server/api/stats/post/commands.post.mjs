import { defineEventHandler, sendNoContent, readBody, getHeader, createError, sendError} from "h3"
import { Point } from "@influxdata/influxdb-client"

export default defineEventHandler(async event => {
	const body = await readBody(event)
	if (!body.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${body.id}`.catch(() => {})
	if (!botExisits[0]) return sendNoContent(event,404)
	if (getHeader(event, "authorization") !== botExisits[0].token) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
	if (body.customCharts?.length > botExisits[0].maxcustomcharts) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const writeClient = event.context.influx.influxClient.getWriteApi("disstat", "defaultBucket")

	if (body.topCommands) {
		const topCommandsPoint = new Point("topCommands")
			.tag("botid",  body.id)

		body.topCommands.map(item => {
			if (item.count.toString().includes(".")) topCommandsPoint.floatField(item.name, item.count)
			else topCommandsPoint.intField(item.name, item.count)
		})

		writeClient.writePoint(topCommandsPoint)
	}

	writeClient.flush()

	sendNoContent(event, 200)
})

export const schema = {
	// body: {
	// 	type: "object",
	// 	properties: {
	// 		id: {
	// 			type: "string",
	// 			// required: true
	// 		},
	// 		topCommands: {
	// 			type: "array",
	// 			items: {
	// 				type: "object",
	// 				properties: {
	// 					name: { type: "string" },
	// 					count: { type: "number" }
	// 				}
	// 			}
	// 		},
	// 	}
	// },
	tags: [
		"Bot Stats"
	],
	responses: {
		401: {
			description: "You do not have permission to access this bot"
		},
		404: {
			description: "Bot not found"
		},
		200: {}
	}
}
