import fastify from "fastify";
import postgresIm from 'postgres'
import Redis from "ioredis";

import {postgres, redisURL, webhooks} from '/config/settings.mjs'

const pgPool = postgresIm(postgres)
const redis = new Redis(redisURL);
const API = fastify();

API.post("/", async (req, reply) => {
	if (!req?.body) return reply.status(400).send();
	if (!req.body.key.startsWith("statcord.com")) return reply.status(401).send();
	if (!req.body.id) return reply.status(400).send();
	
	const botExisits = await pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${req.body.id}`.catch(() => {})
	if (!botExisits[0]) {
		reply.status(404).send();
		if (await redis.exists(`botDubbleNotifCheck:${req.body.id}`)) return;
		fetch(webhooks.newSt, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"embeds": [{"title": "New statcord bot found", "color": 5814783, "fields": [{"name": "id", "value": req.body.id, "inline": true}, {"name": "token", "value": req.body.key, "inline": true}]}]})}).catch(()=>{})
		redis.set(`botDubbleNotifCheck:${req.body.id}`, 1)
		return;
	}
	if (req.body.key !== botExisits[0].token) return reply.status(401).send();
	
	redis.set(`legacyRouteTracking:${req.body.id}`, "v3")

	const ramUsage = (req.body.memactive??0)/((req.body.memload??0)/100)

	fetch(`https://statcord.com/api/bots/${req.body.id}/stats`, {
		"body": {
			"guildCount": req.body.servers ?? 0,
			"members": req.body.users ?? 0,
			"cpuUsage": req.body.cpuload ?? 0,
			"topCommands": req.body.popular ?? [],
			"ramUsage": req.body.memload??0,
			"totalRam": Number.isFinite(ramUsage) ? ramUsage : 0,
			"shardCount": 0,
			"userCount": 0,
			"customCharts": [
				{
					"id": "custom1",
					"data": {
						"custom1": req.body.custom1 ?? 0
					}
				},
				{
					"id": "custom2",
					"data": {
						"custom2": req.body.custom2 ?? 0
					}
				}
			]
		},
		"method": "Post",
		"headers": {
			"Content-Type": "application/json",
			'Authorization': req.body.key,
			"x-prox-redirect": "true"
		}
	})
});

API.listen({ port: 8114, host: "0.0.0.0" }, (err, address) => {
    console.log(`API live on 0.0.0.0:8114`)
    if (err) throw err
});