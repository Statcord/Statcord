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
}
