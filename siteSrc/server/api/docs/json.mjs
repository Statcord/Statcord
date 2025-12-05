import { defineEventHandler } from "h3"
import swaggerRoutes from "~/swaggerRoutes.mjs"

export default defineEventHandler(async () => {
	return swaggerRoutes
})