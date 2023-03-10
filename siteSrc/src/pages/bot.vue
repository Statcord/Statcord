<template>
    <div class="row">
        <div class="col s3">
            <div class="container">
                <div>
                    <img class="circle" :src="'https://cdn.discordapp.com/avatars/' + botid + '/' + avatar + '.png'" alt="">
                    <h3>{{ botName }}</h3>
                </div>

                <h5>Made by: {{ owner }}</h5>
            </div>
        </div>

        <div class="col s9">
            <span>content</span>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'server',
    data() {
        return {
            botid: "",
            botName: "",
            avatar: "",
            owner: "",
            public: false
        }
    },
    async mounted() {
        this.botid = this.$route.params.botid

        const rawBotFetch = await fetch(`/api/bots/${ this.botid}`)
        if (rawBotFetch.status === 401) return window.location.href = `/`;
        if (!rawBotFetch.ok) return alert("error")
        const botJson = await rawBotFetch.json()

        this.botName = botJson.username
        this.avatar = botJson.avatar
        this.owner = botJson.ownername
        this.public = botJson.public
    }
}
</script>