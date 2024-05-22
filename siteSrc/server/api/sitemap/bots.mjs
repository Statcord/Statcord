import { defineEventHandler } from "h3"

export default defineEventHandler(async event => {
	const bots = await event.context.pgPool`SELECT botid from bots WHERE public = true`.catch(() => {})

    return bots.map(a => {
        return {
            loc: `/bots/${a.botid}`
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
