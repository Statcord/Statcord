import { defineEventHandler, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
    const session = await event.context.session(event);
    if (!session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const myBots = await event.context.pgPool`SELECT botid FROM bots WHERE ownerid = ${session.userInfo.id}`.catch(() => {})
    myBots.map(bot => {
        event.context.pgPool`DELETE FROM bots WHERE botid = ${bot.botid}`.catch(() => {})
        event.context.pgPool`DELETE FROM chartsettings WHERE botid = ${bot.botid}`.catch(() => {})
        event.context.pgPool`DELETE FROM mainstats WHERE botid = ${bot.botid}`.catch(() => {})
        event.context.pgPool`DELETE FROM customcharts WHERE botid = ${bot.botid}`.catch(() => {})
        event.context.pgPool`DELETE FROM commandsrun WHERE botid = ${bot.botid}`.catch(() => {})
    })

    event.context.pgPool`DELETE FROM owners WHERE ownerid = ${session.userInfo.id}`.catch(() => {})

    sendNoContent(event, 200)
})