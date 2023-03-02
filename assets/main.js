class Navbar extends HTMLElement {
	constructor() {
		super()

		const shadow = this.attachShadow({mode: "open"})
		const wrapper = document.createElement("nav")
		wrapper.innerHTML =
			"<a href='/'>Startseite</a>" +
			"<a href='/about'>Über uns</a>"

		const style = document.createElement("style")
		style.textContent = `
			a {
				padding: 10px;
				font-size: 20px;
				text-decoration: none;
			}
		`

		shadow.appendChild(style)
		shadow.appendChild(wrapper)
	}
}
customElements.define("global-navbar", Navbar)
