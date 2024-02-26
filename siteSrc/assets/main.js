const encode = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const nav = {
	"/me": "Dashboard",
	"https://discord.com/invite/qsHxVUnXqr": "Discord",
	"/docs": "API Docs",
	"/setup": "Setup",
	"/privacy": "Privacy"
}
function updateNav(elem) {
	const current = window.location.pathname
	elem.innerHTML =
		"<header>" +
		"<div class='banner'>" +
		"We recommend using the new frontend at <a href='https://Statcord.com'>Statcord.com</a>!" +
		"</div>" +
		"<nav>" +
		"<a href='/'><img src='/assets/logo.png' alt='DisStat Logo'></a>" +
		Object.keys(nav).map(path => "<a href='" + encode(path) + "'" + (current == path ? " class='active'" : "") + ">" + encode(nav[path]) + "</a>").join("") +
		"<ion-icon name='invert-mode-outline' onclick='toggleTheme()'></ion-icon>" +
		"</nav>" +
		"</header>"
}
class Navbar extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		updateNav(this)
	}
}
customElements.define("global-navbar", Navbar)

let params = new URLSearchParams(location.search)
window.addEventListener("load", () => {
	if (localStorage.getItem("theme") == "light" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: light)").matches)) document.body.classList.add("light")

	InstantClick.init()
	InstantClick.on("change", () => {
		if (localStorage.getItem("theme") == "light") document.body.classList.add("light")
		params = new URLSearchParams(location.search)

		for (const elem of document.querySelectorAll("global-navbar")) updateNav(elem)
	})
})

function toggleTheme() {
	const theme = document.body.classList.toggle("light") ? "light" : "dark"
	localStorage.setItem("theme", theme == "light" ? "light" : "dark")
}

function updateCard(elem) {
	const bot = JSON.parse(elem.getAttribute("data-bot"))
	elem.innerHTML =
		(bot.avatar ?
			"<img src='https://cdn.discordapp.com/avatars/" + encode(bot.botId) + "/" + encode(bot.avatar) + ".webp?size=64' alt='Avatar of " + encode(bot.username) +
				"' onerror='this.src=\"https://cdn.discordapp.com/embed/avatars/" + (bot.botId % 5) + ".png\"' />"
			: "<img src='https://cdn.discordapp.com/embed/avatars/" + (bot.botId % 5) + ".png' alt='Avatar of " + encode(bot.username) + "' />"
		) +
		"<a href='/bot?id=" + encode(bot.slug || bot.botId) + "'>" + encode(bot.username) + "</a>"
}
class BotCard extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		if (this.hasAttribute("data-bot")) updateCard(this)
	}
	attributeChangedCallback() {
		updateCard(this)
	}
	static get observedAttributes() {
		return ["data-bot"]
	}
}
customElements.define("bot-card", BotCard)

function openDialog(dialog) {
	dialog.style.display = "block"
	dialog.getElementsByClassName("close")[0].onclick = () => {
		dialog.style.display = "none"
	}
	window.onclick = event => {
		if (event.target == dialog) dialog.style.display = "none"
	}
}
