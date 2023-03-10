<template>
    <div class="row">
        <div class="col s3">
            <div class="container">
                <div class="waves-effect waves-light btn" @click="showAPIkeyModel">API key<i class="material-icons left">keygen</i></div>
                <div class="waves-effect waves-light btn" @click="sync">Sync<i class="material-icons left">autorenew</i></div>
                <div class="waves-effect waves-light btn red accent-3" @click="showDeleteModel">Delete<i class="material-icons left">delete_forever</i></div>
            </div>
        </div>

        <div class="col s9">
            <span>content</span>
        </div>
    </div>

    <modal v-show="APIkeyModelVisible" header="API key" @close="closeAPIkeyModel">
        <label for="botid">Enter the Bot ID</label>
        <input type="text" ref="botid" pattern="[0-9]{17,21}" placeholder="685166801394335819">
        <br>
        <br>
        <button @click="submitBot" type="button" id="addbotbutton">Add bot</button>
    </modal>

    <modal v-show="deleteModelVisible" header="Are you sure?" @close="closeDeleteModel">
        <div @click="closeDeleteModel" class="waves-effect waves-light btn " type="button">Cancel</div>
        <div class="waves-effect waves-light btn red accent-3" @click="confirmedDelete">Delete Forever<i class="material-icons left">delete_forever</i></div>
    </modal>
</template>
  
<script>
import modal from '../../components/modal.vue';

export default {
    name: 'server',
    components: {
        modal
    },
    data() {
        return {
            botid: "",

            APIkeyModelVisible: false,
            deleteModelVisible: false
            // botName: "",
            // avatar: "",
            // owner: "",
            // public: false,
            // isOwner: false
        }
    },
    async mounted() {
        this.botid = this.$route.params.botid

        const rawBotFetch = await fetch(`/api/bots/${this.botid}`)
        if (rawBotFetch.status === 401) return window.location.href = `/`;
        if (!rawBotFetch.ok) return alert("error")
        // const botJson = await rawBotFetch.json()

        // this.botName = botJson.username
        // this.avatar = botJson.avatar
        // this.owner = botJson.ownername
        // this.public = botJson.public
        // this.isOwner = botJson.isOwner
    },
    methods: {
        showAPIkeyModel() {
            this.APIkeyModelVisible = true
        },
        showDeleteModel() {
            this.deleteModelVisible = true
        },
        closeAPIkeyModel() {
            this.APIkeyModelVisible = false;
        },
        closeDeleteModel() {
            this.deleteModelVisible = false;
        },




        sync() {
            M.toast({html: 'bot is syncing'})
        },
        async confirmedDelete(){
            const ajaxdata = await fetch(`/api/bots/delete`, {
                method: 'delete',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(err => console.error);
            if (ajaxdata.status === 201) {
                M.toast({html: 'Bot has been deleted'});
                this.deleteModelVisible = false;
                return window.location.href = `/me`
            }
        }
    }
}
</script>