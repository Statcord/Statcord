import postgres from 'postgres'

const sql = postgres({
	/* options */
})
export default sql

export async function getUser(id) {
	return await sql`SELECT * FROM users WHERE id = ${id}`
}
export async function updateUser(id, data) {
	return await sql`UPDATE users SET ${sql(data, ...Object.keys(data))} WHERE id = ${id}`
}

export async function getBot(id) {
	return await sql`SELECT * FROM bots WHERE id = ${id}`
}
export async function updateBot(id, data) {
	return await sql`UPDATE bots SET ${sql(data, ...Object.keys(data))} WHERE id = ${id}`
}

export function genKey() {
	return "DS-xxxxxxxxxxxx4xxxyxxxxxxxx".replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}
