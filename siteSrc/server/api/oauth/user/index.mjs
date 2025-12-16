import { defineEventHandler, createError, sendError } from "h3"

export default defineEventHandler(async event => {
    const session = await event.context.session(event);
    if (!session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    return session.userInfo
})

export const schema = {
    "hidden": true
}
