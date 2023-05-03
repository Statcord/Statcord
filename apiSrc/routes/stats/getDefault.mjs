import influx from '../../utils/influxdb.mjs'
import formatInfluxResponse from '../../structures/formatInfluxResponse.mjs'

export const route = {
	method: 'GET',
	url: '/api/stats/getDefault/:id',
	querystring: {
		start: { type: 'number' },
		end: { type: 'number' }
	},
	schema: {
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
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
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
			placeholders:(request.query.start && request.query.end) ? {
				botid: request.params.id,
				startdate: new Date(Number(request.query.start)).toISOString(),
				enddate: new Date(Number(request.query.end)).toISOString()
			} : {
				botid: request.params.id
			}
		})

		const formatedInfluxResponse = new formatInfluxResponse(mainStatsData).getResponse()
		const formatedCommandResponse = new formatInfluxResponse(commandStatsData).getResponse()

		console.log(commandStatsData)

		if (!formatedInfluxResponse || !formatedCommandResponse) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		reply.send({
			mainStats: formatedInfluxResponse,
			commands: formatedCommandResponse
		})
	}
}
