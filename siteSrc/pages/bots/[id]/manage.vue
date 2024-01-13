<template>
    <div class="container">
        <form action="#">
            <div class="section" v-if="!currentSettingsPending">
                <h6>Access control</h6>
                <div class="row">
                  <div class="col s12 m12">
                    <label for="public">
                      <input type="checkbox" ref="setting:public" name="public" :checked="currentSettings.mainSettings.public" :placeholder="currentSettings.mainSettings.public">
                      <span>Public</span>
                    </label>
                  </div>

                  <div class="col s12 m12">
                    <label for="nsfw">
                      <input type="checkbox" ref="setting:nsfw" name="nsfw" :checked="currentSettings.mainSettings.nsfw" :placeholder="currentSettings.mainSettings.nsfw">
                      <span>NSFW</span>
                    </label>
                  </div>
                </div>

                <div class="row">
                  <div class="col s12 m11">
                    <label for="customurl">Custom URL</label>
                    <input disabled type="url" :placeholder="host + '/bots/' + botid" ref="setting:customurl">
                  </div>
                  <div class="col s12 m1">
                    <div class="waves-effect waves-light btn-large right disabled">Check</div>
                  </div>
                </div>
            </div>

            <div class="divider"></div>
            <div class="section" v-if="!currentSettingsPending">
                <h6>Bot Description</h6>
                <div class="row">
                    <div class="col s12 m12">
                        <label for="shortDesc">Short description</label>
                        <input type="text" ref="setting:shortDesc" :placeholder="currentSettings.mainSettings.shortdesc">
                    </div>

                    <div class="col s12 m12">
                        <label for="longDesc">Long description (Markdown ONLY)</label>
                        <textarea ref="setting:longDesc" :placeholder="currentSettings.mainSettings.longdesc"></textarea>
                    </div>
                </div>
            </div>

            <div class="divider"></div>
            <div class="section" v-if="!currentSettingsPending">
                <h6>Add additional links (optional)</h6>
                <div class="row">
                    <div class="col s12 m6">
                        <label for="github">GitHub</label>
                        <input disabled type="url" ref="github">
                    </div>
                    <div class="col s12 m6">
                        <label for="website">Website</label>
                        <input disabled type="url" ref="website">
                    </div>
                </div>

                <div class="row">
                    <div class="col s12 m6">
                        <label for="supportserver">Support server</label>
                        <input disabled type="url" ref="supportserver">
                    </div>
                    <div class="col s12 m6">
                        <label for="donations">Donation link</label>
                        <input disabled type="url" ref="donations">
                    </div>
                </div>
            </div>


            <!-- <div v-for="(catagory, catagoryIndex) in Object.entries(settings)" :key="catagoryIndex">
                <div class="section"></div>
                <h5>{{catagory[0]}}</h5>
                
                <div v-for="(setting, settingIndex) in Object.entries(catagory[1])" :key="settingIndex">
                    <label>
                        <input :type="setting[1].type" :disabled="!setting[1].enabled" :checked="setting[1].state" :placeholder="setting[1].state" :ref="'setting:'+setting[1].id" :name="'name:'+setting[1].id"/>
                        <span>{{ setting[0] }}</span>
                    </label>
                </div>
            </div> -->

            <!-- <div>
                <div class="section"></div>
                <h5>Access</h5>
                
                <div v-for="(setting, settingIndex) in Object.entries(catagory[1])" :key="settingIndex">
                    <label>
                        <input :type="setting[1].type" :disabled="!setting[1].enabled" :checked="setting[1].state" :placeholder="setting[1].state" :ref="'setting:'+setting[1].id" :name="'name:'+setting[1].id"/>
                        <span>{{ setting[0] }}</span>
                    </label>
                </div>
            </div> -->

            <div class="divider"></div>
            <div class="section">
                <div class="waves-effect waves-light btn modal-trigger" data-target="importModal1"><i class="material-icons left">import_export</i>Import/export data</div>
                <div class="waves-effect waves-light btn modal-trigger" data-target="keyModal1"><i class="material-icons left">keygen</i>API key</div> 
                <div class="waves-effect waves-light btn" @click="sync">Sync<i class="material-icons left">autorenew</i></div>
                <div class="waves-effect waves-light btn" @click="save">Save<i class="material-icons left">save</i></div>
                <div class="waves-effect waves-light btn red modal-trigger" data-target="delModal1"><i class="material-icons left">delete_forever</i>Delete all data</div>
            </div>
        </form>
    </div>


    <div id="importModal1" ref="importModal1" class="modal hide">
        <div class="modal-content">
            <h4>Import/export</h4>
            <select ref="importExportSelector" @change="importExportChanged">
                <option value="export">Export</option>
                <option value="import" disabled>Import</option>
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
                <div class="btn" @click="downloadData"><span>Download</span></div>
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
        "text": input.value,
        "textarea": input.value
    }
}

export default {
    name: 'server',
    data() {
        const config = useRuntimeConfig()
        return {
            host: config.public.domain,
            botid: "",
            apiKey: undefined,
            currentSettingsPending:true,
            currentSettings:{},
            importExport: "export",
            importExportMode:""
        }
    },
    async mounted() {
        if (!await this.$auth.canSeeBot(this.$route.params.id, true)) return await navigateTo(this.$route.fullPath.substring(0, this.$route.fullPath.lastIndexOf('/')))

        this.botid = this.$route.params.id

        const {data: botSettingsJson, pending} = await useFetch(`/api/bots/${this.$route.params.id}/settings/get`)

        this.currentSettingsPending = pending.value
        this.currentSettings = botSettingsJson.value

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
    },
    methods: {
        importExportChanged(event){
            this.importExport = event.target.value
        },
        importSourceChange(event){
            this.importExportMode = event.target.value
        },
        async downloadData(){
            const {data} = await useFetch(`/api/bots/${this.$route.params.id}/stats/export`)

            const a = document.createElement("a");
            a.href = `data:text/plain;base64,${data.value}`;
            a.download = `DisStat_data_export_bot_${this.$route.params.id}.json`;
            a.click();
            a.remove();
        },
        async reGenKey() {
            const {data} = await useFetch(() => `/api/bots/${this.$route.params.id}/settings/genKey`, {
                method: 'post'
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
            const ajaxdata = await $fetch(`/api/bots/${this.$route.params.id}/settings/sync`, {
                method: 'post',
            }).catch(console.error);
            if (ajaxdata) this.$M.toast({text: 'bot has synced'})
            else this.$M.toast({text: 'An error has occurred'})
        },
        async confirmedDelete() {
            const {error} = await useFetch(() => `/api/bots/delete`, {
                method: 'delete',
                body: {id: this.botid}
            })
            if (!error.value) {
                await navigateTo(`/users/${this.$auth.getUser().id}`)
            }
        },
        async save(a){
            this.$M.toast({text: 'Saving'})
            const settings = {}
            Object.keys(this.$refs).filter(a=>a.startsWith("setting:")).forEach(a=>{
                settings[a.replace("setting:", "")] = inputTypeToValue(this.$refs[a])[this.$refs[a].type]
            })

            const {error} = await useFetch(() => `/api/bots/${this.botid}/settings/set`, {
                method: 'post',
                body: settings
            })

            this.$M.toast({text: error.value? 'Error saving' : 'Saved'})
        }
    }
}
</script>
