import { defineEventHandler } from "h3"

export default defineEventHandler(async event => {
	const users = await event.context.pgPool`SELECT DISTINCT ownerid from bots WHERE public = true`.catch(() => {})

    return users.map(a => {
        return {
            loc: `/users/${a.ownerid}`,
			_sitemap: 'users',
        }
    })
})