import { eventHandler, getQuery } from 'h3'

import db from '../../utils/postgres.mjs'

export default eventHandler(
    async (a)=>{
        return await db`SELECT username, avatar, botid FROM bots WHERE public = true LIMIT 30 OFFSET 30*${Number(getQuery(a).page ?? 0)}`.catch(() => {})
    }
)
export const file = "bots/index.mjs"
export const sc = {
    method: 'GET',
	url: '/siteApi/bots',
	schema: {
        querystring: {
			page: { type: 'number', default: 0 }
        },
        response: {
            200: {
                type: 'array',
                items: {
					type: 'object',
					properties: {
						botid: { type: 'string' },
						username: { type: 'string' },
						avatar: { type: 'string' }
					}
				}
            }
        }
	},
}