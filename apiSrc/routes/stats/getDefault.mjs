import influx from '../../utils/influxdb.mjs'
import formatInfluxResponse from '../../structures/formatInfluxResponse.mjs'

export const route = {
	method: 'GET',
	url: '/api/stats/getDefault/:id',
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
		const statsData = await influx.query(`SELECT commandsRun, cpuUsage, guildCount, members, ramUsage, shardCount, totalRam, userCount FROM botStats WHERE botid = $botid ORDER BY time DESC`, {
			placeholders: {
				botid: request.params.id
			}
		})

		const formatedInfluxResponse = new formatInfluxResponse(statsData).getResponse()
		if (!formatedInfluxResponse) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		reply.send(formatedInfluxResponse)
	}
}
