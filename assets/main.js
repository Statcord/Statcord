const encode = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

class Navbar extends HTMLElement {
	constructor() {
		super()
		const shadow = this.attachShadow({mode: "open"})

		const wrapper = document.createElement("nav")
		wrapper.innerHTML =
			"<a href='/'>Home</a>" +
			"<a href='/me'>Dashboard</a>"

		const style = document.createElement("style")
		style.textContent = `
			nav {
				background-color: #CCC;
				padding: 15px;
			}
			a {
				padding: 10px;
				font-size: 25px;
				text-decoration: none;
				color: #227;
			}
		`

		shadow.appendChild(style)
		shadow.appendChild(wrapper)
	}
}
customElements.define("global-navbar", Navbar)

function updateCard(elem) {
	const shadow = elem.shadowRoot
	const bot = JSON.parse(elem.getAttribute("data-bot"))
	console.log(bot)
	shadow.querySelector("div").innerHTML =
		"<img src='https://cdn.discordapp.com/avatars/" + encode(bot.id) + "/" + encode(bot.avatar) + ".webp?size=64' alt='Avatar of " + encode(bot.name) + "' onerror='this.src=\"https://cdn.discordapp.com/embed/avatars/" + (bot.id % 5) + ".png\"' />" +
		"<a href='/bot/" + encode(bot.id) + "'>" + encode(bot.name) + "</a>"
}
class BotCard extends HTMLElement {
	constructor() {
		super()
		const shadow = this.attachShadow({mode: "open"})

		const wrapper = document.createElement("div")
		const style = document.createElement("style")
		style.textContent = `
			div {
				padding: 15px;
				border-radius: 5px;
				background-color: #DDD;
				display: flex;
				align-items: center;
			}
			a {
				font-size: 25px;
				text-decoration: none;
			}
			img {
				border-radius: 50%;
				margin-right: 10px;
				width: 64px;
				height: 64px;
			}
		`

		shadow.appendChild(style)
		shadow.appendChild(wrapper)
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
