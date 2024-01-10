<template>
    <nav>
        <div class="nav-wrapper black">
            <a href="#" data-target="mobile-demo" class="sidenav-trigger">
                <i class="material-icons">menu</i>
            </a>
            <ul class="left hide-on-med-and-down">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/docs">Docs</router-link></li>
                <li><a href="/support">Support</a></li>
                <li><router-link to="/privacy">Privacy</router-link></li>
                <li><router-link to="/guide">Setup guide</router-link></li>
            </ul>

            <ul class="right ">
                <li :class="hideLogin()"><a :href="oauthUrl">Login</a></li>
                <li
                    class="dropdown-trigger"
                    ref="dropdown"
                    :class="hideUserDrop()"
                    data-target="dropdown1"
                    id="userDropdown">
                    <img v-if="username" :src="avatarURL" :alt="username" class="circle left-align" />
                    <i class="material-icons right-align">arrow_drop_down</i>
                </li>
            </ul>
        </div>
    </nav>
    <ul class="sidenav black" ref="sidenav" id="mobile-demo">
        <li><router-link to="/" class="white-text">Home</router-link></li>
        <li><router-link to="/docs" class="white-text">Docs</router-link></li>
        <li><a href="/support" class="white-text">Support</a></li>
        <li><router-link to="/privacy" class="white-text">Privacy</router-link></li>
        <li><router-link to="/guide" class="white-text">Setup guide</router-link></li>
    </ul>
    <ul id="dropdown1" class="dropdown-content valign-wrapper black">
        <router-link :to="'/users/'+userID" class="white-text">User</router-link>
        <li class="divider"></li>
        <li><span @click="logout" class="red-text darken-3">Logout</span></li>
    </ul>
</template>

<script>
export default {
    name: 'navbar',
    data() {
        return {
            username: "",
            avatarURL: "",
            isLoggedIn: false,
            userID: "",
            oauthUrl: this.$genOauthUrl(this.$route.fullPath),
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
            this.userID = user.id
        }
    },
    methods: {
        hideLogin() {
            return this.isLoggedIn ? "hide" : "right"
        },
        hideUserDrop() {
            return this.isLoggedIn ? "right valign-wrapper" : "hide"
        },
        async logout(){
            const { remove } = await useSession()
            await remove()
            await navigateTo("/", {"external": true})
        }
    },
    watch: {
        $route(route){
            this.oauthUrl = this.$genOauthUrl(route.fullPath)
        }
    }
}
</script>
