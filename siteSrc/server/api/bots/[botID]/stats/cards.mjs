import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session?.accessToken && bot[0].ownerid === event.context.session?.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const botStats = (await event.context.pgPool`SELECT guildcount, usercount, members FROM mainstats WHERE botid = ${path.botID} ORDER by timestamp desc limit 1`.catch(() => {}))

	return [
		{
            name: "Guilds",
			value: botStats[0]?.guildcount ?? 0
        },
        {
            name: "Members",
			value: botStats[0]?.members ?? 0
        },
        {
            name: "Users",
			value: botStats[0]?.usercount ?? 0
        }
    ]
})