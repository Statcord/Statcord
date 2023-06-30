import postgres from 'postgres'
import { pgConfig } from '../config.mjs'

const sql = postgres(pgConfig)

export default sql