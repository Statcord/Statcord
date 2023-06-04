<template>
    <nav>
        <div class="nav-wrapper black">
            <router-link to="/login" :class="hideLogin()" id="login">Login</router-link>
            <div
                class="dropdown-trigger"
                ref="dropdown"
                :class="hideUserDrop()"
                data-target="dropdown1"
                id="userDropdown"
            >
                <img v-if="username" :src="avatarURL" :alt="username" class="circle left-align" />
                <i class="material-icons right-align">arrow_drop_down</i>
            </div>
            <a href="#" data-target="mobile-demo" class="sidenav-trigger">
                <i class="material-icons">menu</i>
            </a>
            <ul class="left hide-on-med-and-down">
                <li><router-link to="/">Home</router-link></li>
                <li><a href="/docs">Docs</a></li>
                <li><router-link to="/support">Support</router-link></li>
                <li><router-link to="/privacy">Privacy</router-link></li>
            </ul>
        </div>
    </nav>
    <ul class="sidenav black" ref="sidenav" id="mobile-demo">
        <li><router-link to="/" class="white-text">Home</router-link></li>
        <li><a href="/docs" class="white-text">Docs</a></li>
        <li><router-link to="/support" class="white-text">Support</router-link></li>
        <li><router-link to="/privacy" class="white-text">Privacy</router-link></li>
    </ul>
    <ul id="dropdown1" class="dropdown-content black">
        <li><a href="/me" class="white-text">User</a></li>
        <li class="divider"></li>
        <li><a href="/logout" class="red-text darken-3">Logout</a></li>
    </ul>
</template>

<script>
export default {
    name: 'navbar',
    data() {
        return {
            username: "",
            avatarURL: ``,
            ajaxdataok: false
        }
    },
    async mounted() {
        M.Dropdown.init(this.$refs.dropdown, { coverTrigger: false })
        M.Sidenav.init(this.$refs.sidenav)

        const ajaxdata = await fetch(`/api/discordOauth/user`)
        const ajaxdataJSON = ajaxdata.ok ? await ajaxdata.json() : {}

        this.ajaxdataok = ajaxdata.ok
        this.username = ajaxdataJSON.username
        this.avatarURL = ajaxdata.ok ? `https://cdn.discordapp.com/avatars/${ajaxdataJSON.id}/${ajaxdataJSON.avatar}.webp?size=32` : "https://cdn.discordapp.com/embed/avatars/" + (ajaxdataJSON.id >>> 22) % 5 + ".png"
    },
    methods: {
        hideLogin() {
            return this.ajaxdataok ? "hide" : "right"
        },
        hideUserDrop() {
            return this.ajaxdataok ? "right valign-wrapper" : "hide"
        }
    }
}
</script>
