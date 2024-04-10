import { eventHandler } from 'h3'
// import { deleteSession } from '../../middleware/session'

export default eventHandler(async (event) => {
  await event.context.deleteSession(event)
  // await deleteSession(event)

  // return null
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
