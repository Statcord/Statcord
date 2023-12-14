const get = async (route = "", useAuth = false) => {
	const res = await fetch("https://disstat-api.tomatenkuchen.com/api/" + route.replace(/\.\.[/\\]/g, ""), {
		headers: {
			Authorization: useAuth ? localStorage.getItem("token") : null
		}
	})
	const json = await res.json()
	console.log(json)
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}
const post = async (route, data = {}, returnError = false) => {
	if (route != "login" && !localStorage.getItem("token")) return alert("You are not logged in!")
	const res = await fetch("https://disstat-api.tomatenkuchen.com/api/" + route, {
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

const getBot = async id => {
	if (!/^[0-9]{17,21}$/.test(id)) return
	return await get("bots/" + id + "?timezone=" + new Intl.DateTimeFormat().resolvedOptions().timeZone + "&locale=" + navigator.language + "&groupSize=100")
}
const getBots = async () => await get("bots")
const getBotsFromUser = async () => await get("bots?user=1", true)
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
	if (result.success) location.href = "/bot?id=" + id
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
