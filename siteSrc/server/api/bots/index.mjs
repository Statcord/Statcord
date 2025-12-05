import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async event => {
    const bo = await event.context.pgPool`SELECT username, avatar, botid, nsfw, shortdesc, lastact FROM bots WHERE public = true AND flags != 1 and lastact >= NOW() - INTERVAL '3 days' LIMIT 40 OFFSET 40*${Number(getQuery(event).page ?? 0)}`.catch(()=>{})
    return Promise.all(bo.map(async b=>{
        const g = await event.context.pgPool`select guildcount from mainstats WHERE botid = ${b.botid} order by timestamp desc limit 1`.catch(()=>{})
        return {
            ...b,
            lat: new Date(b.lastact).toDateString()==new Date().toDateString(), 
            gl:g[0]?.guildcount
        }
    }))
})

export const schema = {
	"hidden": true
}
