import { defineEventHandler } from "h3"

let swaggerRoutes = {}
if (import.meta.env) {
    swaggerRoutes = (await import("~/swaggerRoutes.mjs")).default
}

export default defineEventHandler(async () => {
	return swaggerRoutes
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
