import Redis from "ioredis"

export default new Redis(6379, process.env.NODE_ENV === "production" ? "cache" : "192.168.0.23")
