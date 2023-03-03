import Redis from "ioredis"

const redis = new Redis(6379, process.env.NODE_ENV === "production" ? "cache" : "192.168.0.21");

export default redis