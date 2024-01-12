import { defineEventHandler, createError, getRouterParams, readBody, sendError} from "h3"

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const path = getRouterParams(event)

    if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    // console.log("1")
    if (event.context.session.userInfo.id !== path.userID) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    // console.log("2")


    if (Object.keys(body).length === 0) return;

    // console.log("3")

    const botExisits = await event.context.pgPool`SELECT ownerid from owners WHERE ownerid = ${path.userID}`.catch(() => {})
    if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'User not found'}))


    event.context.pgPool`UPDATE owners SET ${event.context.pgPool(body)} WHERE ownerid = ${path.userID}`.catch(() => {})
})

export const schema = {
    hidden: true,
	tags: [
		"Internal"
	],
    parameters: [
        {
          name: 'userID',
          in: 'path',
          required: true,
          content: { media: 'application/json' }
        }
    ],      
    responses: {
        400: {
            description: "Bad request"
        },
		404: {
			description: "Bot not found"
		},
		401: {
			description: "Not authorised"
		},
        200: {}
	}
}
