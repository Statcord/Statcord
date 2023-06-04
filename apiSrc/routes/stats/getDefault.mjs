import influx from '../../utils/influxdb.mjs'
import db from '../../utils/postgres.mjs'
import formatInfluxResponse from '../../structures/formatInfluxResponse.mjs'

export const route = {
	method: 'GET',
	url: '/api/stats/getDefault/:id',
	querystring: {
		start: { type: 'number' },
		end: { type: 'number' }
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
		const bot = await db`SELECT public, ownerid FROM bots WHERE botid = ${request.params.id}`.catch(() => {})
        if (!bot[0]) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})
        if (!bot[0].public && bot[0].ownerid !== request.session.discordUserInfo?.id) return reply.status(401).send({message: "You do not have permission to see this bot"})

		const mainStatsData = await influx.query(
			(request.query.start && request.query.end) ?
			`SELECT cpuUsage, guildCount, members, ramUsage, shardCount, totalRam, userCount FROM botStats WHERE botid = $botid AND time >= $startdate AND time <= $enddate ORDER BY time ASC` :
			`SELECT cpuUsage, guildCount, members, ramUsage, shardCount, totalRam, userCount FROM botStats WHERE botid = $botid ORDER BY time ASC`, {
			placeholders:(request.query.start && request.query.end) ? {
				botid: request.params.id,
				startdate: new Date(Number(request.query.start)).toISOString(),
				enddate: new Date(Number(request.query.end)).toISOString()
			} : {
				botid: request.params.id
			}
		})

		const commandStatsData = await influx.query(
			(request.query.start && request.query.end) ?
			`SELECT * FROM topCommands WHERE botid = $botid AND time >= $startdate AND time <= $enddate ORDER BY time ASC` :
			`SELECT * FROM topCommands WHERE botid = $botid ORDER BY time ASC`, {
			placeholders: request.query.start || request.query.end ? {
				botid: request.params.id,
				startdate: request.query.start ? new Date(Number(request.query.start)).toISOString() : new Date("2023-04-01").toISOString(),
				enddate: request.query.end ? new Date(Number(request.query.end)).toISOString() : new Date().toISOString()
			} : {
				botid: request.params.id
			}
		})

		const customStatsData = await influx.query(
			(request.query.start && request.query.end) ?
			`SELECT * FROM customCharts WHERE botid = $botid AND time >= $startdate AND time <= $enddate ORDER BY time ASC` :
			`SELECT * FROM customCharts WHERE botid = $botid ORDER BY time ASC`, {
			placeholders: request.query.start || request.query.end ? {
				botid: request.params.id,
				startdate: request.query.start ? new Date(Number(request.query.start)).toISOString() : new Date("2023-04-01").toISOString(),
				enddate: request.query.end ? new Date(Number(request.query.end)).toISOString() : new Date().toISOString()
			} : {
				botid: request.params.id
			}
		})

		const formatedInfluxResponse = new formatInfluxResponse(mainStatsData).getResponse()
		const formatedCommandResponse = new formatInfluxResponse(commandStatsData).getResponse()
		const formatedCustomResponse = new formatInfluxResponse(customStatsData).getResponse()

		if (!formatedInfluxResponse) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		reply.send({
			mainStats: formatedInfluxResponse,
			commands: formatedCommandResponse,
			custom: formatedCustomResponse
		})
	}
}
