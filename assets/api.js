const req = async (route, useAuth = false) => {
	const res = await fetch("https://disstat.tomatocake.repl.co/api/" + route, {
		headers: {
			//Authorization: useAuth ? localStorage.getItem("token") : null
		}
	})
	const json = await res.json()
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}

const getBots = async () => req("bots")
const getBot = async id => req("bots/" + id)
