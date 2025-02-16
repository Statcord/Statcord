import Redis from "ioredis";

const {configFile} = useRuntimeConfig()

const redis = new Redis(configFile.redisURL);
const allowedRoutes = [
	"/api/v3/stats",
	"/api/logan/stats",
	"/api/stats/post",

	"/api/v3/stats/",
	"/api/logan/stats/",
	"/api/stats/post/"
]

export default defineEventHandler((event) => {
	const url = event.node.req.url.split("?")[0]
	if (allowedRoutes.includes(url) || (url.startsWith("/api/bots/") && (url.endsWith("/stats")||url.endsWith("/stats/")))) event.context.redis = redis;
});