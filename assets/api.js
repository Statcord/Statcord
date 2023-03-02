const get = async (route, useAuth = false) => {
	const res = await fetch("https://node2.chaoshosting.eu:25517/api/" + route, {
		headers: {
			//Authorization: useAuth ? localStorage.getItem("token") : null
		}
	})
	const json = await res.json()
	console.log(json)
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}
const post = async (route, data = {}) => {
	if (route != "login" && !localStorage.getItem("token")) throw new Error("Not logged in")
	const res = await fetch("https://node2.chaoshosting.eu:25517/api/" + route, {
		method: "post",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: route == "login" ? null : localStorage.getItem("token")
		}
	})
	const json = await res.json()
	console.log(json)
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}

const getBots = async () => await get("bots")
const getBot = async id => await get("bots/" + id)
const getBotsByUser = async user => await get("bots" + (user ? "?user=" + user : ""))
const login = async code => {
	const result = await post("login", {code})
	localStorage.setItem("token", result.token)
	localStorage.setItem("user", result.user)
	localStorage.setItem("avatar", result.avatar)
}
const getAvatar = async id => {
	let avatar = await get("avatar/" + id)
	avatar = avatar ? "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".webp?size=100" : "https://cdn.discordapp.com/embed/avatars/" + (id % 5) + ".png"
	document.getElementById("avatarpreview").src = avatar
}
