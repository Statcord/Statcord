import { defineEventHandler, sendNoContent, readBody, getHeader, createError, sendError } from "h3"
import { Point } from "@influxdata/influxdb-client"

const mainStats = {
    "guildCount": "intField",
	"shardCount": "intField",
	"userCount": "intField",
	"members": "intField",
	"ramUsage": "floatField",
	"totalRam": "floatField",
	"cpuUsage": "floatField"
}
const mainStatsKeys = Object.keys(mainStats)

export default defineEventHandler(async event => {
	const body = await readBody(event)
	if (!body.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${body.id}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (getHeader(event, "authorization") !== botExisits[0].token) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
	if (body.customCharts?.length > botExisits[0].maxcustomcharts) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

    const statsPostBodyKeys = Object.keys(body)
    const hasMainStats = mainStatsKeys.some(key=>statsPostBodyKeys.includes(key))
    if (!hasMainStats && !body.customCharts && !body.topCommands) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const writeClient = event.context.influx.influxClient.getWriteApi("disstat", "defaultBucket")

    if (hasMainStats){
        const mainStatsPoint = new Point("botStats")
        .tag("botid",  body.id)

        mainStatsKeys.forEach(key=>{
            if (statsPostBodyKeys.includes(key)) mainStatsPoint[mainStats[key]](key, body[key])
        })
        writeClient.writePoint(mainStatsPoint)
    }

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
			topCommandsPoint.intField(item.name, item.count)
		})

		writeClient.writePoint(topCommandsPoint)
	}

	writeClient.flush()

	sendNoContent(event, 200)
})

export const schema = {
	schema: {
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
		// 		commandsRun: { type: "number", default: 0 },
		// 		ramUsage: { type: "number", default: 0.0 },
		// 		totalRam: { type: "number", default: 0.0 },
		// 		cpuUsage: { type: "number", default: 0.0 },
		// 		members: { type: "number", default: 0 },
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
		responses: {
			401: {},
			404: {},
			200: {}
		}
	}
}