import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async event => {
    const bo = await event.context.pgPool`SELECT username, avatar, botid, nsfw, shortdesc, lastact FROM bots WHERE public = true AND flags != 1 and lastact >= NOW() - INTERVAL '3 days' LIMIT 40 OFFSET 40*${Number(getQuery(event).page ?? 0)}`.catch(()=>{})
    
    const a = await event.context.pgPool.begin(async sql => bo.map(async b => {
        return sql`select guildcount from mainstats WHERE botid = ${b.botid} order by timestamp desc limit 1`
	}))

    const today = new Date().toDateString()
	
	return await Promise.all(a.map(async (b, i) => {
		const waitedB = await b
		return {
            ...bo[i],
            lat: new Date(bo[i].lastact).toDateString() == today, 
            gl:waitedB?.guildcount ?? waitedB?.[0]?.guildcount
        }
	}))
})

export const schema = {
	"hidden": true
}
