class Navbar extends HTMLElement {
	constructor() {
		super()
		const shadow = this.attachShadow({mode: "open"})

		const wrapper = document.createElement("nav")
		wrapper.innerHTML =
			"<a href='/'>Startseite</a>" +
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
				color: #226;
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
		"<a href='/bot/" + bot.id + "'>" + bot.name + "</a>"
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
				background-color: #CCC;
			}
			a {
				font-size: 25px;
			}
			a:hover {
				text-decoration: underline;
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
	static get observedAttributes() { return ["data-bot"] }
}
customElements.define("bot-card", BotCard)
