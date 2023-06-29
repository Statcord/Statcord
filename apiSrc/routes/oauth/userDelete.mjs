import db from "../../utils/postgres.mjs"
import {influxDelete} from '../../utils/influxdb.mjs'

export const route = {
	method: 'DELETE',
	url: '/siteApi/discordOauth/user/delete',
	schema: {
        hide: true,
        body: {},
		response: {
            401: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            404: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
			201: {
				type: 'object',
				properties: {
					success: { type: 'boolean' },
					message: { type: 'string'}
				}
			}
		}
	},
	handler: async (request, reply) => {
		if (!request.session.discordAccessToken) return reply.code(401).send({error: true, message: "You need to be logged in to add a bot!"});

        const myBots = await db`SELECT botid FROM bots WHERE ownerid = ${request.session.discordUserInfo.id}`.catch(() => {})
        myBots.map(bot => {
            db`DELETE FROM bots WHERE botid = ${bot.botid}`.catch(() => {})

            influxDelete.postDelete({
                org: "disstat",
                bucket:"defaultBucket",
                body: {
                    start: new Date(0),
                    stop: new Date(),
                    // see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
                    predicate: `botid="${bot.botid}"`,
                }
            })
        })

        db`DELETE FROM owners WHERE ownerid = ${request.session.discordUserInfo.id}`.catch(() => {})

        request.session.destroy()

		reply.status(201).send({success: true, message: "Data has been deleted"})
	}
}
