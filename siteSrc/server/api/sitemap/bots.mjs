import { defineEventHandler } from "h3"

export default defineEventHandler(async event => {
	const bots = await event.context.pgPool`SELECT botid from bots WHERE public = true`.catch(() => {})

    return bots.map(a => {
        return {
            loc: `/bots/${a.botid}`,
			_sitemap: 'bots',
        }
    })
})