const req = async (route, useAuth = false) => {
	const res = await fetch("" + route, {
		headers: {
			//Authorization: useAuth ? "Bearer " + localStorage.getItem("token")} : null
		}
	})
	const json = await res.json()
	if (!res.ok) throw new Error(json.message || "Unknown error, status code: " + res.status)
	return json
}

const getBots = async () => req("/api/bots")
const getBot = async id => req("/api/bots/" + id)
