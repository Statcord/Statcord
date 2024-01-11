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

	const mainStatsPoint = new Point("botStats")
	.tag("botid",  body.id)
	.intField("guildCount", body.guildCount)
	.intField("shardCount", body.shardCount)
	.intField("userCount", body.userCount)
	.intField("members", body.members)
	.floatField("ramUsage", body.ramUsage)
	.floatField("totalRam", body.totalRam)
	.floatField("cpuUsage", body.cpuUsage)
	writeClient.writePoint(mainStatsPoint)

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
	// 		guildCount: { type: "number", default: 0 },
	// 		shardCount: { type: "number", default: 0 },
	// 		userCount: { type: "number", default: 0 },
	// 		ramUsage: { type: "number", default: 0.0 },
	// 		totalRam: { type: "number", default: 0.0 },
	// 		cpuUsage: { type: "number", default: 0.0 },
	// 		members: { type: "number", default: 0 }
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
