import db from '../../utils/postgres.mjs'

import { defaultChartSettings } from '../../utils/supportedCharts.mjs'

export const route = {
	method: 'GET',
	url: '/api/stats/types/:id',
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
				contains: { type: "object" }
            }
        }
	},
	handler: async (request, reply) => {

		const bots = ['961433265879801936', '901245095502819358', '939114998700048436']

		bots.map(bot=>{
			Object.keys(defaultChartSettings).map(async key =>{
				const item = defaultChartSettings[key]
				db`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${bot}, ${key}, ${item.name}, ${item.label}, ${item.type})`.catch(err=>{})
			})

		})


		const bot = await db`SELECT public, ownerid FROM bots WHERE botid = ${request.params.id}`.catch(err=>{})
        if (!bot[0]) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})
        if (!bot[0].public && bot[0].ownerid !== request.session.discordUserInfo?.id) return reply.status(401).send({message: "You do not have permission to see this bot"})

		const settings = await db`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${request.params.id}`.catch(err=>{})

		reply.send(settings)
	}
}
