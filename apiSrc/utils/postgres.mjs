import postgres from 'postgres'

const { pgConfig } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../config/config.mjs')

const sql = postgres(pgConfig)

export default sql