// Taken from https://github.com/DEVTomatoCake/dashboard/blob/6fbf31f50d0be6a61a05f9d40b7e805eece1c2e5/dev.js

const getLocalIpAddress = () => {
	const interfaces = require("node:os").networkInterfaces()
	for (const iface of Object.values(interfaces)) {
		for (const info of iface) {
			if (!info.internal && info.family == "IPv4") return info.address
		}
	}
	return null
}

const { WebSocketServer } = require("ws")
const wss = new WebSocketServer({port: 6942})

wss.on("connection", ws => {
	ws.on("error", console.error)

	setInterval(() => {
		ws.ping()
	}, 45000)
})

const wsRestart =
	"<script>" +
	"const devSocket = new WebSocket('ws://localhost:6942');" +
	"devSocket.onclose = () => location.reload();" +
	"devSocket.onmessage = () => location.reload();" +
	"</script>"

const fs = require("node:fs").promises
const express = require("express")
const app = express()

app.disable("x-powered-by")
app.disable("etag")
app.disable("view cache")

app.listen(4269)

const localIP = getLocalIpAddress()
app.listen(4269, localIP)
console.log("Running on http://" + localIP + ":4269 (no backend) and http://localhost:4269")

app.get("*", async (req, res) => {
	if (req.url.includes("/assets/") || req.url.endsWith(".js") || req.url.endsWith(".json") || req.url.endsWith(".txt") || req.url.endsWith(".xml"))
		return res.sendFile(req.url, { root: "./siteSrc", lastModified: false, dotfiles: "deny", maxAge: 0 })

	if (req.url == "/") req.url = "/index"
	const path = "./siteSrc" + req.url.replace(/\.[^/.]+$/, "").split("?")[0].split("#")[0] + ".html"

	try {
		const file = await fs.readFile(path, "utf8")
		res.set({
			"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
			Pragma: "no-cache",
			Expires: 0
		})
		res.send(file + wsRestart)
	} catch (e) {
		console.log(e)
		res.status(404).send({status: "error", message: "Unable to find file: " + path})
	}
})

process.on("SIGINT", () => wss.close())
