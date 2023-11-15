<template>
    <div class="navbar-fixed  red accent-1">
        <div class="nav-wrapper">
            <h4 class="center-align">Not all Settings are supported at this time.</h4>
        </div>
    </div>

    <div class="container">
        <div v-for="(catagory, catagoryIndex) in Object.entries(settings)" :key="catagoryIndex">
            <div class="section"></div>
            <h5>{{catagory[0]}}</h5>
            
            <div v-for="(setting, settingIndex) in Object.entries(catagory[1])" :key="settingIndex">
                <!-- <span>{{ setting }}</span> -->
                <input :type="setting[1].type" :disabled="!setting[1].enabled" :checked="setting[1].state" :placeholder="setting[1].state" :ref="'setting:'+setting[1].id" :name="'name:'+setting[1].id"/>
                <span>{{ setting[0] }}</span>
            </div>
        </div>
       
        <div class="section">
            <div class="waves-effect waves-light btn modal-trigger" data-target="importModal1"><i class="material-icons left">import_export</i>Import/export data</div>
            <div class="waves-effect waves-light btn modal-trigger" data-target="keyModal1"><i class="material-icons left">keygen</i>API key</div> 
            <div class="waves-effect waves-light btn" @click="sync">Sync<i class="material-icons left">autorenew</i></div>
            <div class="waves-effect waves-light btn" @click="save">Save<i class="material-icons left">save</i></div>
            <div class="waves-effect waves-light btn red modal-trigger" data-target="delModal1"><i class="material-icons left">delete_forever</i>Delete all data</div>
        </div>
    </div>


    <div id="importModal1" ref="importModal1" class="modal hide">
        <div class="modal-content">
            <h4>Import/export</h4>
            <select ref="importExportSelector" @change="importExportChanged">
                <option value="import">Import</option>
                <option value="export">Export</option>
            </select>
            <label>Would you like to import or export</label>
           
            <div v-if="importExport === 'import'">
                <select ref="importSourceSelector" @change="importSourceChange">
                    <option value="disStat">DisStat</option>
                    <option value="statcord">Statcord</option>
                    <option value="json">JSON</option>
                </select>

                <div v-if="importExportMode === 'disStat' || importExportMode === 'json'" class="btn">Upload</div>
                <div v-else class="btn">Go</div>
            </div>
            <div v-else>
                <div class="btn"><span>Download zip</span></div>
            </div>
        </div>
        <div class="modal-footer">
            <div>
                <div class="modal-close waves-effect waves-light btn left">Close</div>
            </div>
        </div>
    </div>


    <div id="keyModal1" ref="keyModal1" class="modal hide">
        <div class="modal-content">
            <h4>API key</h4>
           
            <div v-if="apiKey">
                <input type="text" disabled :value="apiKey">
                <div class="waves-effect waves-light btn" @click="copyKey">copy<i class="material-icons left">content_copy</i></div>
            </div>
        </div>
        <div class="modal-footer">
            <div>
                <div class="modal-close waves-effect waves-light btn left">Close</div>
                <div class="waves-effect waves-light btn" @click="reGenKey">Regenerate API key<i class="material-icons left">autorenew</i></div>
            </div>
        </div>
    </div>

    <div id="delModal1" ref="delModal1" class="modal hide">
        <div class="modal-content">
            <h4>Confirm data deletion</h4>
        </div>
        <div class="modal-footer">
            <div>
                <div class="modal-close waves-effect waves-light btn left">Cancel</div>
                <div class="modal-close waves-effect waves-light btn red accent-3 right" @click="confirmedDelete">Delete forever (really!)<i class="material-icons left">delete_forever</i></div>
            </div>
        </div>
    </div>
</template>

<script setup>
 import { useRoute } from 'vue-router';
    const route = useRoute()
    // const id = ref(route.params.id)
    const bot = await $fetch(`/api/bots/${route.params.id}`)
    // console.log(route)
    useSeoMeta({
        title: () =>`DisStat - ${bot?.username}`,
        ogTitle: () => `DisStat - ${bot?.username}`,
        description:  () => `Manage ${bot?.username} on DisStat.`,
        ogDescription:  () => `Manage ${bot?.username} on DisStat.`,
        ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        // twitterCard: 'summary_large_image',
        ogUrl: () => `https://disstat.numselli.xyz/bots/${route.params.id}/manage`,
        twitterTitle: () =>`DisStat - ${bot?.username}`,
        twitterDescription:  () => `Manage ${bot?.username} on DisStat.`,
})
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
    }
  ]
})
</script>

<script>
const inputTypeToValue = (input)=> {
    return {
        "checkbox": input.checked,
        "text": input.value
    }
}

export default {
    name: 'server',
    data() {
        return {
            botid: "",
            apiKey: undefined,
            settings:{},
            importExport: "import",
            importExportMode:""
        }
    },
    async mounted() {
        if (!await this.$auth.canSeeBot(this.$route.params.id, true)) return await navigateTo(this.$route.fullPath.substring(0, this.$route.fullPath.lastIndexOf('/')))

        this.botid = this.$route.params.id

        this.$M.FormSelect.init(this.$refs.importExportSelector)
        this.$M.FormSelect.init(this.$refs.importSourceSelector)

        this.$M.Modal.init(this.$refs.keyModal1, {
            onOpenStart: ()=> this.$refs.keyModal1.classList.remove("hide")
        })
        this.$M.Modal.init(this.$refs.delModal1, {
            onOpenStart: ()=> this.$refs.delModal1.classList.remove("hide")
        })
        this.$M.Modal.init(this.$refs.importModal1, {
            onOpenStart: ()=> this.$refs.importModal1.classList.remove("hide")
        })


        const {data: botSettingsJson} = await useFetch(`/api/bots/${this.$route.params.id}/settings/get`, {
            server: false
        })

        
        botSettingsJson.value.forEach(chart => {
            if (this.settings[chart.catagory]) {
                this.settings[chart.catagory][chart.name] = chart
            } else {
                this.settings[chart.catagory]={}
                this.settings[chart.catagory][chart.name] = chart
            }
        })
    },
    methods: {
        importExportChanged(event){
            this.importExport = event.target.value
        },
        importSourceChange(event){
            this.importExportMode = event.target.value
        },
        async reGenKey() {
            const {data} = await useFetch(() => `/api/bots/genKey`, {
                method: 'post',
                body: JSON.stringify({id: this.botid}),
                headers: {'Content-Type': 'application/json'}
            })
            if (data.value?.key) {
                this.apiKey = data.value.key
            }
        },
        copyKey() {
            navigator.clipboard.writeText(this.apiKey)
        },
        async sync() {
            this.$M.toast({text: 'bot is syncing'})
            const ajaxdata = await $fetch(`/api/bots/sync`, {
                method: 'post',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(console.error);
            if (ajaxdata) this.$M.toast({text: 'bot has synced'})
            else this.$M.toast({text: 'An error has occurred'})
        },
        async confirmedDelete() {
            const {error} = await useFetch(() => `/api/bots/delete`, {
                method: 'delete',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            })
            if (!error.value) {
                await navigateTo("/users/me")
            }
        },
        async save(a){
            const settings = {}
            Object.keys(this.$refs).filter(a=>a.startsWith("setting:")).forEach(a=>{
                settings[a.replace("setting:", "")] = inputTypeToValue(this.$refs[a][0])[this.$refs[a][0].type]
            })

            const {error} = await useFetch(() => `/api/bots/${this.botid}/settings/set`, {
                method: 'post',
                body: JSON.stringify(settings),
                headers: {'Content-Type': 'application/json'}
            })
            // console.log(error.value)
            this.$M.toast({text: error.value? 'Error saving' : 'Saved'})
            // if (!error.value) {
            //     this.apiKey = data.value.key
            // }


            console.log(settings)
        }
    }
}
</script>
