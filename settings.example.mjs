export default {
    discord: {
        botToken:'Bot OTYxNDMzMj3ADOykpKutVrH8',
        botID: '96143336',
        clientSecret:'wmz0ConGSrm',
    },

    postgres: {
        user: "disstat",
        database: "disstat",
        password: "AQwrkR9v",
        host: "192.168.0.23",
        port: 5432,
        idle_timeout: 5
    },
    influx: {
        url: 'http://192.168.0.23:8086',
        token: "yh3dPN9s"
    },

    webhooks: {
        newSt: "https://discord.com/api/webhooks/12093557rhDzU",
    },

    version: "1.0.0",
    domain:'http://localhost:3000',
    redisURL: 'redis://192.168.0.23:6379'
}