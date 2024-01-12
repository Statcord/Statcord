import { defineEventHandler } from "h3"
if (import.meta.env) {
    var {default: swaggerRoutes} = await import("~/swaggerRoutes.mjs")
}

export default defineEventHandler(async event => {
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
