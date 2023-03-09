import postgres from 'postgres'

const { pgConfig } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../config/config.mjs')

const sql = postgres(pgConfig)

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
