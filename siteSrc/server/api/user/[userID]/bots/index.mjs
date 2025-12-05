import { defineEventHandler, getQuery, getRouterParams } from "h3"

export default defineEventHandler(async event => {
    const path = getRouterParams(event)

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
	"hidden": true
}
