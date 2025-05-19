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

export const schema = {
	hidden: true,
	tags: [
		"Internal"
	],
	responses: {
		200: {
			// type: "object",
			// properties: {
			// 	swagger: { type: "string" },
			// 	info: { type: "object" },
			// 	definitions: { type: "object" },
			// 	paths: { type: "object" }
			// }
		}
	}
}
