import { defineEventHandler, getQuery, getRouterParams } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

	const bo = await event.context.pgPool`SELECT lastact, username, avatar, botid, nsfw, shortdesc FROM bots WHERE ownerid = ${path.userID} LIMIT 30 OFFSET 30*${Number(getQuery(event).page ?? 0)}`.catch().catch(() => {})
	
    const a = await Promise.all(bo.map(async b => {
        return event.context.pgPool`select guildcount from mainstats WHERE botid = ${b.botid} order by timestamp desc limit 1`
    }))
	
	return await Promise.all(a.map(async (b, i) => {
		const waitedB = await b
		return {
            ...bo[i],
            lat: new Date(bo[i].lastact).toDateString()==new Date().toDateString(), 
            gl:waitedB?.[0]?.guildcount
        }
	}))
})

export const schema = {
	"hidden": true
}
