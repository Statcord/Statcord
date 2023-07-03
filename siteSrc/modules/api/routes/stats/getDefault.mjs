import { eventHandler, sendNoContent, getCookie, getQuery } from 'h3'
import { flux, fluxDuration } from '@influxdata/influxdb-client'

if (import.meta.env) {
    var {default: db} = await import('~/utils/postgres.mjs')
	var {influxClient} = await import('~/utils/influxdb.mjs')
    var {default: redis} = await import('~/utils/redis.mjs')
}

export default eventHandler(
    async (a)=>{
		if (!a.context.params.id) return sendNoContent(a, 404)
		const bot = await db`SELECT public, ownerid FROM bots WHERE botid = ${a.context.params.id}`.catch(() => {})
		if (!bot[0]) return sendNoContent(a, 404)

		const sessionID = getCookie(a, "sessionId")?.split(".")[0]
		const session = sessionID ? JSON.parse(await redis.get(`sess:${sessionID}`)) : null
		
		const isOwner = !!session && bot[0].ownerid === session.discordUserInfo.id
		const isPublic = bot[0].public

		if ((!isPublic && !isOwner)) return sendNoContent(a, 401)

		const query = getQuery(a)

		const start = new Date(Number(query.start ?? 0)).toISOString()
		const stop = query.end ? new Date(Number(query.end)).toISOString() : new Date().toISOString()

		// console.time("first")
		const mainStats = await fetchFromInflux({
			measurement: "botStats",
			start,
			stop,
			groupBy: query.groupBy,
			botID: a.context.params.id
		})
		// console.timeEnd("first")

		// console.time("second")
		const commands = await fetchFromInflux({
			measurement: "customCharts",
			start,
			stop,
			groupBy: query.groupBy,
			botID: a.context.params.id
		})
		// console.timeEnd("second")

		// console.time("thrid")
		const custom = await fetchFromInflux({
			measurement: "topCommands",
			start,
			stop,
			groupBy: query.groupBy,
			botID: a.context.params.id
		})
		// console.timeEnd("thrid")

		if (!mainStats) return sendNoContent(a, 404)

		return {
			mainStats,
			commands,
			custom
		}
    }
)
export const file = "stats/getDefualt.mjs"
export const schema = {
	method: 'GET',
	url: '/siteApi/stats/getDefault/:id',
	schema: {
        hide: true,
		path: {
			id: { type: 'string' }
		},
		querystring: {
			start: { type: 'number', default: 0 },
			end: { type: 'number', default: 0 },
			groupBy: { type: 'string' },
        },
        response: {
			404: {},
            401: {},
            200: {
				type: 'object',
				properties: {
					mainStats: {
						type: "array",
						items: {
							type: 'object',
							properties: {
								time: { type: 'string' },
								type: { type: 'number' },
								cpuUsage: { type: 'number' },
								guildCount: { type: 'number' },
								members: { type: 'number' },
								ramUsage: { type: 'number' },
								shardCount: { type: 'number' },
								totalRam: { type: 'number' },
								userCount: { type: 'number' },
							}
						}
					},
					commands: {
						type: "array",
						contains: { type: "object" }
					},
					custom: {
						type: "array",
						contains: { type: "object" }
					}
				}
			}
        }
	}
}

const fetchFromInflux = async (options) => {
	const queryApi = influxClient.getQueryApi("disstat")

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