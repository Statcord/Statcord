<template>
    <nav>
        <div class="nav-wrapper black">
            <a href="#" data-target="mobile-demo" class="sidenav-trigger">
                <i class="material-icons">menu</i>
            </a>
            <ul class="left hide-on-med-and-down">
                <li><router-link to="/">Home</router-link></li>
                <li><a href="/docs">Docs</a></li>
                <li><router-link to="/support">Support</router-link></li>
                <li><router-link to="/privacy">Privacy</router-link></li>
            </ul>

            <ul class="right ">
                <li :class="hideLogin()"><a href="/login">Login</a></li>
                <div
                    class="dropdown-trigger"
                    ref="dropdown"
                    :class="hideUserDrop()"
                    data-target="dropdown1"
                    id="userDropdown">
                    <img v-if="username" :src="avatarURL" :alt="username" class="circle left-align" />
                    <i class="material-icons right-align">arrow_drop_down</i>
                </div>
            </ul>
        </div>
    </nav>
    <ul class="sidenav black" ref="sidenav" id="mobile-demo">
        <li><router-link to="/" class="white-text">Home</router-link></li>
        <li><a href="/docs" class="white-text">Docs</a></li>
        <li><router-link to="/support" class="white-text">Support</router-link></li>
        <li><router-link to="/privacy" class="white-text">Privacy</router-link></li>
    </ul>
    <ul id="dropdown1" class="dropdown-content valign-wrapper black">
        <a href="/users/me" class="white-text">User</a>
        <li class="divider"></li>
        <a href="/logout" class="red-text darken-3">Logout</a>
    </ul>
</template>

<script>
export default {
    name: 'navbar',
    data() {
        return {
            username: "",
            avatarURL: "",
            isLoggedIn: false
        }
    },
    async mounted() {
        this.$M.Sidenav.init(this.$refs.sidenav)

        if (this.$auth.isLoggedIn()){
            this.$M.Dropdown.init(this.$refs.dropdown, { coverTrigger: false })
            this.isLoggedIn = true;

            const user = this.$auth.getUser()

            this.username = user.username
            this.avatarURL = `https://cdn.discordapp.com/avatars/${user.avatar ? `${user.id}/${user.avatar}.webp`: `${(user.id >>> 22) % 5}.png`}?size=32`
        }
    },
    methods: {
        hideLogin() {
            return this.isLoggedIn ? "hide" : "right"
        },
        hideUserDrop() {
            return this.isLoggedIn ? "right valign-wrapper" : "hide"
        }
    }
}
</script>
