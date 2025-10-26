import { defineEventHandler, getQuery, createError, getRouterParams, sendError } from "h3"

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
	
	if (!event.context.validateTimes(query.t)) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const timeFormated = event.context.formatTime(query.t);

	const sdafsdf = await event.context.pgPool`SELECT chartid, name, label, type, category FROM chartsettings WHERE botid = ${path.botID} AND enabled = true and name !='Total Ram' and category = 'custom'`.catch(() => {})
	return await Promise.all(sdafsdf.map(async type => {
		const customcharts = await event.context.pgPool`select avg(value), DATE_TRUNC(${timeFormated.groupBy}, timestamp)::date AS t from customcharts where botid = ${path.botID} and chartid = ${type.chartid} and timestamp > ${timeFormated.start} group by t`
		const d = genTemp(type, customcharts)
		d.data.datasets[0].data = customcharts.map(a=>Number(a.avg.toFixed(2)))
		return d
	}))
})

export const schema = {
	hidden: true
}