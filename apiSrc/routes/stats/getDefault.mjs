import { influxClient } from '../../utils/influxdb.mjs'
import db from '../../utils/postgres.mjs'
import { flux, fluxDuration } from '@influxdata/influxdb-client'

export const route = {
	method: 'GET',
	url: '/api/stats/getDefault/:id',
	querystring: {
		start: { type: 'number' },
		end: { type: 'number' },
		groupBy: { type: 'string' }
	},
	schema: {
		hide: true,
		path: {
			id: { type: 'string' }
		},
		response: {
			404: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'The bot with the specified ID does not exist!' }
				}
			},
			401: {
				type: 'object',
				properties: {
					message: { type: 'string', default: "You do not have permission to see this bot" }
				}
			},
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
	},
	handler: async (request, reply) => {
		const bot = await db`SELECT public, ownerid FROM bots WHERE botid = ${request.params.id}`.catch(() => { })
		if (!bot[0]) return reply.status(404).send({ message: "The bot with the specified ID does not exist!" })
		if (!bot[0].public && bot[0].ownerid !== request.session.discordUserInfo?.id) return reply.status(401).send({ message: "You do not have permission to see this bot" })

		const start = new Date(Number(request.query.start)).toISOString()
		const stop = new Date(Number(request.query.end)).toISOString()

		const mainStats = await fetchFromInflux({
			measurement: "botStats",
			start,
			stop,
			groupBy: request.query.groupBy,
			botID: request.params.id
		})

		const commands = await fetchFromInflux({
			measurement: "customCharts",
			start,
			stop,
			groupBy: request.query.groupBy,
			botID: request.params.id
		})
		
		const custom = await fetchFromInflux({
			measurement: "topCommands",
			start,
			stop,
			groupBy: request.query.groupBy,
			botID: request.params.id
		})

		if (!mainStats) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		reply.send({
			mainStats,
			commands,
			custom
		})
	}
}


const fetchFromInflux = async (options) => {
	const queryApi = influxClient.getQueryApi("disstat")
	// |> range(start: 0) 

	const fluxQuery = flux`from(bucket:"defualtBucket") 
	|> range(start: ${options.start}, stop: ${options.stop}) 
	|> filter(fn: (r) => r._measurement == ${options.measurement})
	|> filter(fn: (r) => r["botid"] == ${options.botID})
	|> group(columns: ["_time", "_field"])
	|> aggregateWindow(every: ${fluxDuration(options.groupBy)}, fn: mean, createEmpty: false)
	|> yield(name: "mean")`

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