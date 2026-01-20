import fastify from "fastify";
import postgres from 'postgres'
import Redis from "ioredis";
import config from '/config/settings.mjs'

const pgPool = postgres(config.postgres)
const redis = new Redis(config.redisURL);
const API = fastify();

const bandwidthIGnore = [
	"934124735246266429",
	"568083171455795200",
	"559426966151757824",
]
const custom1IGnore = [
	"969003682324676648",
	"940618428039958608",
	"885954920681971723",
	"877644741339144244",
	"829603142173196308",
	"828969964253610016",
	"816152179101663312",
	"785196430796914758",
	"761269120691470357",
	"746781930078601367",
	"736086156759924762",
	"735984537863192638",
	"691003447603888158",
	"690256111282290834",
	"674135840019972125",
	"634059474012995594",
	"488809387910234145",
	"484461035315527700",
	"417385666763161600",
	"1032011958448308284",
	"934124735246266429",
	"568083171455795200",
	"559426966151757824",
]
const custom2IGnore = [
	"969003682324676648",
	"940618428039958608",
	"885954920681971723",
	"877644741339144244",
	"829603142173196308",
	"828969964253610016",
	"816152179101663312",
	"785196430796914758",
	"761269120691470357",
	"746781930078601367",
	"736086156759924762",
	"735984537863192638",
	"691003447603888158",
	"690256111282290834",
	"674135840019972125",
	"634059474012995594",
	"488809387910234145",
	"484461035315527700",
	"417385666763161600",
	"1032011958448308284",
	"934124735246266429",
	"568083171455795200",
	"559426966151757824",
]

API.post("/api/v3/stats", async (req, reply) => {
	if (!req?.body) return reply.status(400).send();
	if (!req.body.key.startsWith("statcord.com")) return reply.status(401).send();
	if (!req.body.id) return reply.status(400).send();
	
	const botExisits = await pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${req.body.id}`.catch(() => {})
	if (!botExisits[0]) {
		reply.status(404).send();
		if (await redis.exists(`botDubbleNotifCheck:${req.body.id}`)) return;
		fetch(config.webhooks.newSt, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"embeds": [{"title": "New statcord bot found", "color": 5814783, "fields": [{"name": "id", "value": req.body.id, "inline": true}, {"name": "token", "value": req.body.key, "inline": true}]}]})}).catch(()=>{})
		redis.set(`botDubbleNotifCheck:${req.body.id}`, 1)
		return;
	}
	if (req.body.key !== botExisits[0].token) return reply.status(401).send();
	
	redis.set(`legacyRouteTracking:${req.body.id}`, "v3")

	const ramUsage = (req.body.memactive??0)/((req.body.memload??0)/100)

	const body = {
		"guildCount": Number(req.body.servers) ?? 0,
		"members": Number(req.body.users) ?? 0,
		"cpuUsage": Number(req.body.cpuload) ?? 0,
		"topCommands": req.body.popular ?? [],
		"ramUsage": Number(req.body.memload) ?? 0,
		"totalRam": Number.isFinite(ramUsage) ? ramUsage : 0,
		"shardCount": 0,
		"userCount": 0,
	}
	if (!(bandwidthIGnore.includes(req.body.id) || custom1IGnore.includes(req.body.id) || custom2IGnore.includes(req.body.id))){
		body.customCharts = []
		if (!bandwidthIGnore.includes(req.body.id)) body.customCharts.push({"id": "bandwidth","data": {"bandwidth": req.body.bandwidth ?? 0}})
		if (!custom1IGnore.includes(req.body.id)) body.customCharts.push({"id": "custom1","data": {"custom1": req.body.custom1 ?? 0}})
		if (!custom2IGnore.includes(req.body.id)) body.customCharts.push({"id": "custom2","data": {"custom2": req.body.custom2 ?? 0}})
	}
	
	const f = await fetch(`https://statcord.com/api/bots/${req.body.id}/stats`, {
		"body": JSON.stringify(body),
		"method": "Post",
		"headers": {
			"Content-Type": "application/json",
			'Authorization': req.body.key,
			"xproxredirect": "true"
		}
	})
	if (!f.ok) {
		console.log(await f.text())
		console.log(body)
	}
});

API.listen({ port: 8114, host: "0.0.0.0" }, (err, address) => {
    console.log(`API live on 0.0.0.0:8114`)
    if (err) throw err
});