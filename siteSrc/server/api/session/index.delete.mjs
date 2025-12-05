import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  await event.context.deleteSession(event)
})

export const schema = {
	hidden: true
}
