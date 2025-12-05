import { defineEventHandler, createError, sendError } from "h3"

export default defineEventHandler(async event => {
    if (!event.context.session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    return event.context.session.userInfo
})

export const schema = {
    "hidden": true
}
