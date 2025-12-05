import Redis from "ioredis";

const {configFile} = useRuntimeConfig()

const redis = new Redis(configFile.redisURL);

export default defineEventHandler((event) => {
	event.context.redis = redis;
});