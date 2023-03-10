<template>
    <div class="row">
        <div class="col s3">
            <div class="container">

                <div class="waves-effect waves-light btn">Sync<i class="material-icons left">autorenew</i></div>
                <div class="waves-effect waves-light btn red accent-3">Delete<i class="material-icons left">delete_forever</i></div>

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
            // botName: "",
            // avatar: "",
            // owner: "",
            // public: false,
            // isOwner: false
        }
    },
    async mounted() {
        this.botid = this.$route.params.botid

        const rawBotFetch = await fetch(`/api/bots/${ this.botid}`)
        if (rawBotFetch.status === 401) return window.location.href = `/`;
        if (!rawBotFetch.ok) return alert("error")
        // const botJson = await rawBotFetch.json()

        // this.botName = botJson.username
        // this.avatar = botJson.avatar
        // this.owner = botJson.ownername
        // this.public = botJson.public
        // this.isOwner = botJson.isOwner
    }
}
</script>