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

	if (body.customCharts) {
		body.customCharts.map(customChart => {
			event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${body.id}, ${customChart.id}, ${`placeholder for ${customChart.id}`}, ${`placeholder for ${customChart.id}`}, "line") ON CONFLICT (botid, chartid) DO NOTHING`.catch(() => {})

			const customChartsPoint = new Point("customCharts")
				.tag("botid",  body.id)
				.tag("customChartID",  customChart.id)

			Object.keys(customChart.data).forEach(key => {
				const value = customChart.data[key]
				if (value.toString().includes(".")) customChartsPoint.floatField(key, value)
				else customChartsPoint.intField(key, value)
			})

			writeClient.writePoint(customChartsPoint)
		})
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
	// 		customCharts: {
	// 			type: "array",
	// 			items: {
	// 				type: "object",
	// 				properties: {
	// 					id: { type: "string" },
	// 					data: { type: "object" }
	// 				}
	// 			}
	// 		}
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
