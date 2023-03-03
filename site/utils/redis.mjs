import Redis from "ioredis"

export default new Redis(6379, process.env.NODE_ENV === "production" ? "cache" : "127.0.0.1");