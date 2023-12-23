module.exports = {
	ci: {
		collect: {
			staticDistDir: "./siteSrc/",
			url: [
				"./index.html",
				"./docs.html",
				"./setup.html",
				"./privacy.html",
				"./bot.html?id=tk"
			]
		},
		upload: {
			target: "temporary-public-storage"
		}
	}
}
