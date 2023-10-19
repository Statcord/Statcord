import { defineEventHandler } from "h3"
if (import.meta.env) {
    var {default: swaggerRoutes} = await import("~/swaggerRoutes.mjs")
}

export default defineEventHandler(
    async a => {
        return swaggerRoutes
    }
)
export const file = "docs/json.mjs"
export const schema = {
	method: "GET",
	url: "/api/docs/json",
	schema: {
        hide: true,
        response: {
            200: {
				type: "object",
				properties: {
					swagger: { type: "string" },
					info: { type: "object" },
					definitions: { type: "object" },
					paths: { type: "object" }
				}
            }
        }
	}
}
