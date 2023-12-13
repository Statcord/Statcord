const encode = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

class Navbar extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		const current = window.location.pathname
		this.innerHTML =
			"<nav>" +
			(current == "/" ? "<span>Home</span>" : "<a href='/'>Home</a>") +
			(current == "/me" ? "<span>Dashboard</span>" : "<a href='/me'>Dashboard</a>") +
			"<a href='https://app.swaggerhub.com/apis-docs/DisStat/DisStat/1.0.1' target='_blank' rel='noopener'>Docs</a>" +
			"</nav>"
	}
}
customElements.define("global-navbar", Navbar)

function updateCard(elem) {
	const bot = JSON.parse(elem.getAttribute("data-bot"))
	elem.innerHTML =
		"<div class='botcard'>" +
		"<img src='https://cdn.discordapp.com/avatars/" + encode(bot.id) + "/" + encode(bot.avatar) + ".webp?size=64' alt='Avatar of " + encode(bot.name) +
		"' onerror='this.src=\"https://cdn.discordapp.com/embed/avatars/" + (bot.id % 5) + ".png\"' />" +
		"<a href='/bot/?id=" + encode(bot.id) + "'>" + encode(bot.name) + "</a>" +
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
	dialog.getElementsByClassName("close")[0].onclick = function() {
		dialog.style.display = "none"
	}
	window.onclick = function(event) {
		if (event.target == dialog) dialog.style.display = "none"
	}
}
