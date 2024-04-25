import { defineEventHandler, sendNoContent, createError, sendError } from "h3"

export default defineEventHandler(async event => {
    if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const myBots = await event.context.pgPool`SELECT botid FROM bots WHERE ownerid = ${event.context.session.userInfo.id}`.catch(() => {})
    myBots.map(bot => {
        event.context.pgPool`DELETE FROM bots WHERE botid = ${bot.botid}`.catch(() => {})

        event.context.influx.influxDelete.postDelete({
            org: "disstat",
            bucket:"defaultBucket",
            body: {
                start: new Date(0),
                stop: new Date(),
                // see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
                predicate: `botid="${bot.botid}"`,
            }
        })
    })

    event.context.pgPool`DELETE FROM owners WHERE ownerid = ${event.context.session.userInfo.id}`.catch(() => {})

    sendNoContent(event, 200)
})

export const schema = {
    // body: {},
    hidden: true,
	tags: [
		"Internal"
	],
    responses: {
        401: {
			description: "You do not have permission to access this user"
		},
        200: {}
    }
}
