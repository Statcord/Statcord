const get = async (route, useAuth = false) => {
	const res = await fetch("https://node2.chaoshosting.eu:25517/api/" + route, {
		headers: {
			//Authorization: useAuth ? localStorage.getItem("token") : null
		}
	})
	const json = await res.json()
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}
const post = async (route, data = {}) => {
	if (route != "login" && !localStorage.getItem("token")) throw new Error("Not logged in")
	const res = await fetch("https://node2.chaoshosting.eu:25517/api/" + route, {
		method: "post",
		body: JSON.stringify(data),
		headers: {
			Authorization: localStorage.getItem("token")
		}
	})
	const json = await res.json()
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}

const getBots = async () => await get("bots")
const getBot = async id => await get("bots/" + id)
const login = async code => await post("login", {code})
