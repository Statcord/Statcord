const get = async (route = "", useAuth = false) => {
	const res = await fetch("https://disstat-api.tomatenkuchen.com/api/" + route.replace(/[^\w?&=/-]/gi, ""), {
		headers: {
			Authorization: useAuth ? localStorage.getItem("token") : void 0
		}
	})
	const json = await res.json()
	console.log(json)
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}
const post = async (route = "", data = {}, returnError = false) => {
	if (route != "login" && !localStorage.getItem("token")) return alert("You are not logged in!")

	const res = await fetch("https://disstat-api.tomatenkuchen.com/api/" + route.replace(/[^\w?&=/-]/gi, ""), {
		method: "post",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: route == "login" ? null : localStorage.getItem("token")
		}
	})
	const json = await res.json()
	console.log(json)
	if (!res.ok) {
		if (returnError) console.error(json.message || "Unknown error, status code: " + res.status)
		else throw new Error(json.message || "Unknown error, status code: " + res.status)
	}
	return json
}

let bot = {}
const getBot = async () => {
	const startTime = document.getElementById("start-time")?.value
	const endTime = document.getElementById("end-time")?.value
	const dataPoints = document.getElementById("data-points")?.value || 90

	return await get(
		"bots/" + new URLSearchParams(location.search).get("id") + "?timezone=" + new Intl.DateTimeFormat().resolvedOptions().timeZone + "&locale=" + navigator.language +
		(startTime ? "&start=" + startTime : "") +
		(endTime ? "&end=" + endTime : "") +
		"&dataPoints=" + dataPoints, true
	)
}
const getBots = async () => await get("bots")
const getBotsFromUser = async () => await get("bots?user=1", true)
const postSettings = async (id, settings) => await post("bots/" + id, settings, true)

const login = async code => {
	const result = await post("login", {code})
	localStorage.setItem("token", result.token)
	localStorage.setItem("user", result.user)
	localStorage.setItem("avatar", result.avatar)
	location.href = location.href.split("?")[0]
}
const getAvatar = async id => {
	if (!/^[0-9]{17,21}$/.test(id)) return
	const json = await get("avatar/" + id, true)
	const avatar = json.a ? "https://cdn.discordapp.com/avatars/" + id + "/" + json.a + ".webp?size=64" : "https://cdn.discordapp.com/embed/avatars/" + (id % 5) + ".png"
	document.getElementById("avatarpreview").src = avatar
	document.getElementById("addbotbutton").disabled = !json.b
	document.getElementById("botid").setCustomValidity(json.b ? "" : "This is not a bot!")
	document.getElementById("botid").reportValidity()
}
const addBot = async () => {
	const id = document.getElementById("botid").value
	if (!/^[0-9]{17,21}$/.test(id)) return

	const result = await post("bots", {id}, true)
	if (result.success) location.href = "/bot?id=" + id + "&setup=1"
	else alert(result.message)
}
const getKey = async () => {
	const result = await get("key", true)
	document.getElementById("botapikey").value = result.key
}
const regenKey = async () => {
	document.getElementById("regen-apikey").setAttribute("disabled", "")
	const result = await post("key")
	document.getElementById("botapikey").value = result.key
	document.getElementById("regen-apikey").removeAttribute("disabled")
}

async function saveSettings() {
	const result = await postSettings(bot.botId, {
		slug: document.getElementById("slug").value,
		public: document.getElementById("public").checked,
		nsfw: document.getElementById("nsfw").checked
	})
	if (result.message) return alert(result.message)

	document.getElementById("save-button").classList.add("green")
	setTimeout(() => document.getElementById("save-button").classList.remove("green"), 1000)
}

async function statcordImport(state) {
	if (state != "importStarted" && state != "dismissed") return

	const result = await get(bot.botId + "/statcord?state=" + state, true)
	if (result.message) return alert(result.message)

	if (state == "importStarted") alert("Import has been started and will take a few minutes to complete.")
	location.href = "/bot?id=" + (bot.slug || bot.botId)
}
