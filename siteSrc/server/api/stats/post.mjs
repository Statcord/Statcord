import { defineEventHandler, sendNoContent, readBody, getHeader, createError } from "h3"
import { Point } from "@influxdata/influxdb-client"

export default defineEventHandler(async event => {
	const body = await readBody(event)
	if (!body.id) throw createError({
		statusCode: 400
	})

	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${body.id}`.catch(() => {})
	if (!botExisits[0]) return sendNoContent(event,404)
	if (getHeader(event, "authorization") !== botExisits[0].token) throw createError({
		statusCode: 401
	})
	if (body.customCharts?.length > botExisits[0].maxcustomcharts) throw createError({
		statusCode: 400
	})

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
	method: "POST",
	url: "/api/stats/post",
	schema: {
		body: {
			type: "object",
			properties: {
				id: {
					type: "string",
					// required: true
				},
				guildCount: { type: "number", default: 0 },
				shardCount: { type: "number", default: 0 },
				userCount: { type: "number", default: 0 },
				commandsRun: { type: "number", default: 0 },
				ramUsage: { type: "number", default: 0.0 },
				totalRam: { type: "number", default: 0.0 },
				cpuUsage: { type: "number", default: 0.0 },
				members: { type: "number", default: 0 },
				topCommands: {
					type: "array",
					items: {
						type: "object",
						properties: {
							name: { type: "string" },
							count: { type: "number" }
						}
					}
				},
				customCharts: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							data: { type: "object" }
						}
					}
				}
			}
		},
		response: {
			401: {},
			404: {},
			200: {}
		}
	}
}
