import { eventHandler } from 'h3'

export default eventHandler(
    async (a)=>{

    }
)
export const file = "docs/json.mjs"
export const schema = {
	method: 'GET',
	url: '/docs/json',
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