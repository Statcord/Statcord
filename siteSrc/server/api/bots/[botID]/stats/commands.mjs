import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"
import { formatTime, validateTimes } from "~/server/utils/times.mjs"

const genTemp = (type ,botStats) => {
	return {
		name: type.name,
		type: type.type,
		labels: botStats.map(a=>a.t),
		data: {
			datasets: [
				{
					label: type.label
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

	const isOwner = !!event.context.session?.accessToken && bot[0].ownerid === event.context.session?.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)
	if (!query.t) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	
	if (!validateTimes(query.t)) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const timeFormated = formatTime(query.t);
	
	const sdafsdf = await event.context.pgPool`SELECT chartid, name, label, type, category FROM chartsettings WHERE botid = ${path.botID} AND enabled = true and name !='Total Ram' and category = 'commands'`.catch(() => {})
	return await Promise.all(sdafsdf.map(async type => {
		const cmdData = await event.context.pgPool`select sum(amount), ${type.chartid === "cmdTotalUse" ? event.context.pgPool`DATE_TRUNC(${timeFormated.groupBy}, ${event.context.pgPool('timestamp')})::date` : event.context.pgPool('command')} AS t from commandsrun where botid = ${path.botID} and timestamp > ${timeFormated.start} group by t`
		const d = genTemp(type, cmdData)
		d.data.datasets[0].data = cmdData.map(a=>a.sum)
		return d
	}))
})