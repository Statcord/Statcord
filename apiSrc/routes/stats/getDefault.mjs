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
				type: "array",
				items: {
					type: 'object',
					properties: {
						time: { type: 'string' },
						type: { type: 'number' },
						commandsRun: { type: 'number' },
						cpuUsage: { type: 'number' },
						guildCount: { type: 'number' },
						members: { type: 'number' },
						ramUsage: { type: 'number' },
						shardCount: { type: 'number' },
						totalRam: { type: 'number' },
						userCount: { type: 'number' },
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
		const statsData = await influx.query(
			(request.query.star && request.query.end) ? 
			`SELECT commandsRun, cpuUsage, guildCount, members, ramUsage, shardCount, totalRam, userCount FROM botStats WHERE botid = $botid AND time >= $startDate AND time <= $endDate ORDER BY time ASC` : 
			`SELECT commandsRun, cpuUsage, guildCount, members, ramUsage, shardCount, totalRam, userCount FROM botStats WHERE botid = $botid ORDER BY time ASC`, {
			placeholders:(request.query.start && request.query.end) ? {
				botid: request.params.id,
				startDate: new Date(request.query.start).toISOString(),
				endDate: new Date(request.query.end).toISOString()
			} : {
				botid: request.params.id
			}
		})

		const formatedInfluxResponse = new formatInfluxResponse(statsData).getResponse()
		if (!formatedInfluxResponse) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		reply.send(formatedInfluxResponse)
	}
}
