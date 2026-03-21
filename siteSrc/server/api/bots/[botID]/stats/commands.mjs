import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"
import { formatTime, validateTimes } from "~/server/utils/times.mjs"

const genTemp = (type, botStats) => {
	return {
		name: type.name,
		type: type.type,
		data: {
			datasets: [
				{
					data: botStats.map(a=>a.sum)
				}
			]
		}
	}
}

export default defineEventHandler(async event => {
	const path = getRouterParams(event)
	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const session = await event.context.session(event);
	const isOwner = !!session?.accessToken && bot[0].ownerid === session?.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)
	if (!query.t) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	
	if (!validateTimes(query.t)) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const timeFormated = formatTime(query.t);
	
	const sdafsdf = await event.context.pgPool`SELECT chartid, name, label, type, category FROM chartsettings WHERE botid = ${path.botID} AND enabled = true and name !='Total Ram' and category = 'commands'`.catch(() => {})

	const a = await event.context.pgPool.begin(async sql => sdafsdf.map(async type => {
		return sql`select sum(amount), ${type.chartid === "cmdTotalUse" ? sql`DATE_TRUNC(${timeFormated.groupBy}, ${sql('timestamp')})::date` : sql('command')} AS t from commandsrun where botid = ${path.botID} and timestamp > ${timeFormated.start} group by t`
	}))
	
	return await Promise.all(a.map(async (type, i) => {
		const waitedType = await type
		const d = genTemp(sdafsdf[i], waitedType)
		if (sdafsdf[i].name === "Command usage over time") d.labels = waitedType.map(a=>a.t)
		else d.data.labels = waitedType.map(a=>a.t)

		return d
	}))
})