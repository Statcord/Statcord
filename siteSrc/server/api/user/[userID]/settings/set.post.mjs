import { defineEventHandler, createError, getRouterParams, readBody, sendError} from "h3"

export default defineEventHandler(async event => {
    const session = await event.context.session(event);
    if (!session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
    
    const path = getRouterParams(event)
    if (session.userInfo.id !== path.userID) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const body = await readBody(event)
    if (Object.keys(body).length === 0) return;

    const botExisits = await event.context.pgPool`SELECT ownerid from owners WHERE ownerid = ${path.userID}`.catch(() => {})
    if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'User not found'}))

    await event.context.pgPool`UPDATE owners SET ${event.context.pgPool(body)} WHERE ownerid = ${path.userID}`.catch(() => {})
})