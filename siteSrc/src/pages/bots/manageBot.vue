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
        <div class="waves-effect waves-light btn" @click="reGenKey">Regenerate API key<i class="material-icons left">autorenew</i></div>
        <div v-if="apiKey">
            <div class="waves-effect waves-light btn" @click="copyKey">copy<i class="material-icons left">content_copy</i></div>
            <input type="text" disabled :value="apiKey">
        </div>
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
            deleteModelVisible: false,
            apiKey: undefined
        }
    },
    async mounted() {
        this.botid = this.$route.params.botid

        const rawBotFetch = await fetch(`/api/bots/${this.botid}`)
        if (rawBotFetch.status === 401) return window.location.href = `/`;
        if (!rawBotFetch.ok) return window.location.href = `/`;

        const botJson = await rawBotFetch.json()
        if (!botJson.isOwner) return window.location.href = `/`;
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
        async reGenKey(){
            const ajaxdata = await fetch(`/api/bots/genKey`, {
                method: 'post',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(err => console.error);
            if (ajaxdata.status === 201) {
                const keyJson = await ajaxdata.json()
                this.apiKey = keyJson.key
            }
        },
        copyKey(){
            navigator.clipboard.writeText(this.apiKey);
        },
        async sync() {
            M.toast({html: 'bot is syncing'})
            const ajaxdata = await fetch(`/api/bots/sync`, {
                method: 'post',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(err => console.error);
            if (ajaxdata.status === 201) {
                M.toast({html: 'bot has synced'})
            }
        },
        async confirmedDelete(){
            const ajaxdata = await fetch(`/api/bots/delete`, {
                method: 'delete',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(err => console.error);
            if (ajaxdata.status === 201) {
                return window.location.href = `/me`
            }
        }
    }
}
</script>