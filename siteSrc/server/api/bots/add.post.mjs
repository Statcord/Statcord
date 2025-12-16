import { defineEventHandler, readBody, sendNoContent, sendError, createError } from "h3"
import { z } from 'zod'
import genKey from "~/server/utils/genKey.mjs"

const zodSchema = z.object({
	botid: z.string().cuid2(),
	invite: z.url(),
	nsfw: z.boolean(),
	public: z.boolean(),
	customurl: z.url().optional(),
	shortDesc: z.string(),
	github: z.url().optional(),
	website: z.url().optional(),
	supportserver: z.url().optional(),
	donations: z.url().optional()
})

export default defineEventHandler(async event => {
	const session = await event.context.session(event);
	if (!session?.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const body = await readBody(event)
	const zodResponse = await zodSchema.safeParseAsync(body)
	if (!zodResponse.success)  return sendError(event, createError({statusCode: 400, statusMessage: zodResponse.error.message}))

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${body.botid}`.catch(() => {})
	if (botExisits[0]) return sendError(event, createError({statusCode: 409, statusMessage: 'Bot already exists'}))

	const OAuthHelper = event.context.oauth.rest.oauth.getHelper(`Bearer ${session.accessToken}`)
    const ownsBot = await OAuthHelper.ownsApplication(body.botid);
	if (!ownsBot) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const bot = await event.context.oauth.rest.users.get(body.botid).catch(e=>{})
	if (!bot) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	event.context.pgPool`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon, public, nsfw, invite, shortdesc) VALUES (${body.botid}, ${bot.username}, ${bot.avatar}, ${genKey()}, ${session.userInfo.id}, now(), ${body.public}, ${body.nsfw}, ${body.invite}, ${body.shortDesc})`.catch(() => {})

	const botLinks = [
		{
			name: "supportserver",
			url: body.supportserver,
			icon: "link",
			botid: body.botid
		}
	]

	
	const defaultChartSettings = [
		{
			chartid: "guildCount",
			name: "Guild Growth",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},
		{
			chartid: "shardCount",
			name: "Shards",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},
		{
			chartid: "members",
			name: "Members",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},
		{
			chartid: "userCount",
			name: "User Count",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},
		{
			chartid: "cpuUsage",
			name: "CPU Usage",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},
		{
			chartid: "ramUsage",
			name: "Ram Usage",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},
		{
			chartid: "totalRam",
			name: "Total Ram",
			type: "line",
			label: "This Week",
			category: "default",
			botid: body.botid
		},	
		{
			chartid: "topCmds",
			name: "Popular Commands",
			type: 'pie',
			label: 'Fully Rounded',
			category: "commands",
			botid: body.botid
		},
		{
			chartid: "cmdTotalUse",
			name: "Command usage over time",
			type: "line",
			label: "This week",
			category: "commands",
			botid: body.botid
		}
	]

	event.context.pgPool`INSERT INTO botlinks ${event.context.pgPool(botLinks)}`.catch(() => {})
	event.context.pgPool`INSERT INTO chartsettings ${event.context.pgPool(defaultChartSettings)}`.catch(() => {})

	sendNoContent(event, 200)
})

export const schema = {
	"hidden": true
}
