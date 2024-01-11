import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"
import { flux, fluxDuration } from "@influxdata/influxdb-client"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))


	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)

	const start = new Date(Number(query.start ?? 0)).toISOString()
	const stop = query.end ? new Date(Number(query.end)).toISOString() : new Date().toISOString()

	// console.time("first")
	const mainStats = await fetchFromInflux({
		event,
		measurement: "botStats",
		start,
		stop,
		groupBy: query.groupBy ?? "1d",
		botID: path.botID
	})
	// console.timeEnd("first")

	// console.time("second")
	const commands = await fetchFromInflux({
		event,
		measurement: "customCharts",
		start,
		stop,
		groupBy: query.groupBy ?? "1d",
		botID: path.botID
	})
	// console.timeEnd("second")

	// console.time("thrid")
	const custom = await fetchFromInflux({
		event,
		measurement: "topCommands",
		start,
		stop,
		groupBy: query.groupBy ?? "1d",
		botID: path.botID
	})
	// console.timeEnd("thrid")

	return {
		mainStats,
		commands,
		custom
	}
})

export const schema = {
	// path: {
	// 	id: { type: "string" }
	// },
	// querystring: {
	// 	start: { type: "number", default: 0 },
	// 	end: { type: "number", default: 0 },
	// 	groupBy: { type: "string" },
	// },
	// parameters:[
    //     {
    //         name: "start",
    //         in: "query",
    //         required: false,
    //         content: {
    //             media: "application/json"
    //         },
    //         "description": "The page number of bots to show"
    //     },
	// 	{
    //         name: "end",
    //         in: "query",
    //         required: false,
    //         content: {
    //             media: "application/json"
    //         },
    //         "description": "The page number of bots to show"
    //     },
	// 	{
    //         name: "groupBy",
    //         in: "query",
    //         required: false,
    //         content: {
    //             media: "application/json"
    //         },
    //         "description": "The page number of bots to show"
    //     }
    // ],
	tags: [
		"Bot Stats"
	],
	responses: {
		404: {
			description: "Bot not found"
		},
		401: {
			description: "You do not have permission to access this bot"
		},
		200: {
			// type: "object",
			// properties: {
			// 	mainStats: {
			// 		type: "array",
			// 		items: {
			// 			type: "object",
			// 			properties: {
			// 				time: { type: "string" },
			// 				type: { type: "number" },
			// 				cpuUsage: { type: "number" },
			// 				guildCount: { type: "number" },
			// 				members: { type: "number" },
			// 				ramUsage: { type: "number" },
			// 				shardCount: { type: "number" },
			// 				totalRam: { type: "number" },
			// 				userCount: { type: "number" },
			// 			}
			// 		}
			// 	},
			// 	commands: {
			// 		type: "array",
			// 		contains: { type: "object" }
			// 	},
			// 	custom: {
			// 		type: "array",
			// 		contains: { type: "object" }
			// 	}
			// }
		}
	}
}

const fetchFromInflux = async (options) => {
	const queryApi = options.event.context.influx.influxClient.getQueryApi("disstat")

	const fluxQuery = flux`import "math"
	from(bucket:"defaultBucket")
	|> range(start: time(v: ${options.start}), stop: time(v: ${options.stop}))
	|> filter(fn: (r) => r._measurement == ${options.measurement})
	|> filter(fn: (r) => r["botid"] == ${options.botID})
	|> aggregateWindow(every: ${fluxDuration(options.groupBy ?? "1d")}, fn: mean, createEmpty: false)
    |> map(fn: (r) => ({r with _value: math.round(x: r._value)}))
	|> yield(name: "mean")`
	// this slows down requests by 9.92%
	// |> group(columns: ["_time", "_field"])

	let outData = [];
	for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
		const tableObject = tableMeta.toObject(values)

		const timeIndex = outData.findIndex(element => element.time === tableObject._time)
		if (timeIndex === -1) outData.push({
			time: tableObject._time,
			[tableObject._field]: tableObject._value
		})
		else outData[timeIndex][tableObject._field] = tableObject._value
	}

	return outData;
}
