import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)
    // console.log(path)

	// if (!event.context.session?.accessToken)
	// return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const bo = await event.context.pgPool`SELECT username, avatar, botid, nsfw, shortdesc FROM bots WHERE ownerid = ${path.userID} LIMIT 30 OFFSET 30*${Number(getQuery(event).page ?? 0)}`.catch().catch(() => {})
	const botids = bo.map(a=>a.botid)
	const active = await event.context.pgPool`select distinct botid, max(timestamp) from mainstats where timestamp >= NOW() - INTERVAL '3 days' and botid in ${event.context.pgPool(botids)} group by botid`.catch(() => {})
	return Promise.all(bo.map(async b=>{
		const g = await event.context.pgPool`select guildcount from mainstats WHERE botid = ${b.botid} order by timestamp desc limit 1`.catch(()=>{})
        return {
            ...b,
            r: typeof active.find(a=>a.botid==b.botid) == 'undefined',
            gl:g[0]?.guildcount
        }
    }))
})

export const schema = {
	// querystring: {
	// 	page: { type: "number", default: 0 }
	// },
	parameters: [
		{
		  name: 'userID',
		  in: 'path',
		  required: true,
		  content: { media: 'application/json' }
		}
	],
	"hidden": true,
	"tags": [
		"Internal"
	],
	responses: {
		401: {
			description: "You do not have permission to access this user"
		},
		200: {
			// type: "array",
			// items: {
			// 	type: "object",
			// 	properties: {
			// 		botid: { type: "string" },
			// 		username: { type: "string" },
			// 		avatar: { type: "string" }
			// 	}
			// }
		}
	}
}
