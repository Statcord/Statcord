import { defineEventHandler, sendRedirect, getQuery, createError, sendError} from "h3"

export default defineEventHandler(async event => {
    const { code, state } = getQuery(event);
    if (!code) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

    const {tokens, redirect} = await event.context.oauth.exchangeCode({
        code
    })

    if (!tokens?.accessToken) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

    const OAuthHelper = event.context.oauth.rest.oauth.getHelper(`Bearer ${tokens.accessToken}`)
    const userInfo = (await OAuthHelper.getCurrentAuthorizationInformation()).user;

    const session = {
        ...await event.context.ensureSession(event),
        accessToken: tokens.accessToken,
        userInfo
    }

    event.context.setStorageSession(session.id, session)

    event.context.pgPool`INSERT INTO owners(username, ownerid, avatar) VALUES (${userInfo.global_name}, ${userInfo.id}, ${userInfo.avatar}) ON CONFLICT (ownerid) DO UPDATE SET username = ${userInfo.global_name}, avatar = ${userInfo.avatar}`.catch(() => {})

    return sendRedirect(event, `${redirect}${state}`, 302)
})

export const schema = {
    hidden: true,
	tags: [
		"Internal"
	],
    responses: {
        302: {}
    }
}