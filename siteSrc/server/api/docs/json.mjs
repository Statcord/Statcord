import { defineEventHandler } from "h3"

export default defineEventHandler(async event => {
	return event.context.openapiJSON
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
