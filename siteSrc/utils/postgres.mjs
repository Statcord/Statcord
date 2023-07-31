import postgres from 'postgres'

const sql = postgres({
    "host": "192.168.0.23",
    "port": 5436,
    // "host": "postgres",
	// "port": 5432,
	"database": "disstat",
	"username": "disstat",
	"password": process.env.postgresPassword,
	"idle_timeout": 1
})

export default sql