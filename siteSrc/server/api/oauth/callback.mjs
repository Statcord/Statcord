import { defineEventHandler, sendRedirect, getQuery, createError} from "h3"

export default defineEventHandler(async event => {
    const { code, state } = getQuery(event);
    if (!code) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

    const {tokens, redirect} = await event.context.oauth.exchangeCode({
        code
    })

    if (!tokens?.accessToken) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

    const OAuthHelper = event.context.oauth.rest.oauth.getHelper(`Bearer ${tokens.accessToken}`)
    const userInfo = (await OAuthHelper.getCurrentAuthorizationInformation()).user;


    // accessToken: 'QtKOY9TH3oAnpAa',
    // expiresIn: 604800,
    // refreshToken: '0tAWgcNjG5W',
    // scopes: [ 'applications.builds.read', 'identify' ],
    // tokenType: 'Bearer',
    // webhook: null

    event.context.session.accessToken = tokens.accessToken,
    event.context.session.userInfo = userInfo
    
    event.context.pgPool`INSERT INTO owners(username, ownerid, avatar) VALUES (${userInfo.global_name}, ${userInfo.id}, ${userInfo.avatar}) ON CONFLICT (ownerid) DO UPDATE SET username = ${userInfo.global_name}, avatar = ${userInfo.avatar}`.catch(() => {})

    return sendRedirect(event, `${redirect}${state}`, 302)
})

export const schema = {
    // querystring: {
    //     code: { type: "string" }
    // },
    hidden: true,
	tags: [
		"Internal"
	],
    responses: {
        302: {}
    }
}