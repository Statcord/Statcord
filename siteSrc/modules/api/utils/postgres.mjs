import postgres from 'postgres'
import {pgConfig} from '../../config/config.mjs'

const sql = postgres(pgConfig)

export default sql