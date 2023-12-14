const encode = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const nav = {
	"/me": "Dashboard",
	"/discord": "Discord",
	"/docs": "API Docs",
	"/setup": "Setup",
	"/privacy": "Privacy"
}
function updateNav(elem) {
	const current = window.location.pathname
	elem.innerHTML =
		"<nav>" +
		"<a href='/'><img src='/assets/logo.png' alt='DisStat Logo'></a>" +
		Object.keys(nav).map(path => "<a href='" + encode(path) + "'" + (current == path ? " class='active'" : "") + ">" + encode(nav[path]) + "</a>").join("") +
		"<ion-icon name='invert-mode-outline'></ion-icon>" +
		"</nav>"
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

window.addEventListener("load", () => {
	InstantClick.on("change", () => {
		for (const elem of document.querySelectorAll("global-navbar")) updateNav(elem)
	})
})

function updateCard(elem) {
	const bot = JSON.parse(elem.getAttribute("data-bot"))
	elem.innerHTML =
		"<div class='botcard'>" +
		"<img src='https://cdn.discordapp.com/avatars/" + encode(bot.botId) + "/" + encode(bot.avatar) + ".webp?size=64' alt='Avatar of " + encode(bot.username) +
		"' onerror='this.src=\"https://cdn.discordapp.com/embed/avatars/" + (bot.botId % 5) + ".png\"' />" +
		"<a href='/bot?id=" + encode(bot.slug || bot.botId) + "'>" + encode(bot.username) + "</a>" +
		"</div>"
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
