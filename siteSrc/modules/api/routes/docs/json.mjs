import { eventHandler } from 'h3'
if (import.meta.env) {
    var {default: swaggerRoutes} = await import('~/swaggerRoutes.mjs')
}

export default eventHandler(
    async (a)=>{
        return swaggerRoutes
    }
)
export const file = "docs/json.mjs"
export const schema = {
	method: 'GET',
	url: '/api/docs/json',
	schema: {
        response: {
            200: {
				type: 'object',
                properties: {
                }
            }
        }
	}
}
