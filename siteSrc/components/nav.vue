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
                <li><router-link to="/pricing">Pricing</router-link></li>
                <li><router-link to="/partners">Partners</router-link></li>
            </ul>

            <ul class="right ">
                <li :class="user ? 'hide' : ''"><a :href="oauthUrl">Login</a></li>
                <li v-if="user"
                    class="dropdown-trigger"
                    ref="dropdown"
                    :class="user ? 'right valign-wrapper' : 'hide'"
                    data-target="dropdown1"
                    id="userDropdown">
                    <img :src="`https://cdn.discordapp.com/avatars/${user.avatar ? `${user.id}/${user.avatar}.${(user.avatar.startsWith('a_')?'gif':'webp')}`: `${(user.id >>> 22) % 5}.png`}?size=32`" :alt="user.username" class="circle left-align" />
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
        <li><router-link to="/pricing" class="white-text">Pricing</router-link></li>
        <li><router-link to="/partners" class="white-text">Partners</router-link></li>
    </ul>
    <ul v-if="user" ref="dropdownContent" id="dropdown1" class="dropdown-content valign-wrapper black">
        <li><router-link :to="'/users/'+user.id" class="white-text">User</router-link></li>
        <li class="divider"></li>
        <li><span @click="logout" class="red-text darken-3">Logout</span></li>
    </ul>
</template>


<script setup>
    const headers = useRequestHeaders(['cookie'])

    const { data: userFetch } = await useAsyncData(async () => {
        const [user] = await Promise.all([
            $fetch(`/api/oauth/user`, { headers })
        ])
        return user
    })

    const user = userFetch.value
</script>


<script>
export default {
    name: 'navbar',
    data() {
        return {
            oauthUrl: this.$genOauthUrl(this.$route.fullPath),
        }
    },
    async mounted() {
        // console.log(this.$refs.dropdownContent)
        this.$M.Sidenav.init(this.$refs.sidenav)

        if (this.$refs.dropdownContent) this.$M.Dropdown.init(this.$refs.dropdown, { coverTrigger: false })
    },
    methods: {
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
