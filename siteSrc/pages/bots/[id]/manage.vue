<template>
    <div class="container">
        <form action="#">
            <div class="section" v-if="!currentSettingsPending">
                <h6>Access control</h6>
                <div class="row">
                  <div class="col s12 m12">
                    <label>
                      <input type="checkbox" ref="setting:public" name="public" :checked="currentSettings.mainSettings.public" :placeholder="currentSettings.mainSettings.public">
                      <span>Public</span>
                    </label>
                  </div>

                  <div class="col s12 m12">
                    <label>
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
                <div class="row" style="gap: 10px;">
                    <div class="col s12 m6">
                        <label for="github">GitHub</label>
                        <input type="url" :placeholder="currentSettings.links.github" ref="setting:github">
                    </div>
                    <div class="col s12 m6">
                        <label for="website">Website</label>
                        <input type="url" :placeholder="currentSettings.links.website" ref="setting:website">
                    </div>
                </div>

                <div class="row" style="gap: 10px;">
                    <div class="col s12 m6">
                        <label for="supportserver">Support server</label>
                        <input type="url" :placeholder="currentSettings.links.supportserver" ref="setting:supportserver">
                    </div>
                    <div class="col s12 m6">
                        <label for="donations">Donation link</label>
                        <input type="url" :placeholder="currentSettings.links.donations" ref="setting:donations">
                    </div>
                </div>
            </div>

            <div class="divider"></div>
            <div class="section" v-if="!currentSettingsPending">
                <h6>Defualt charts</h6>
                <div class="row">
                    <div v-for="chart in currentSettings.defaultChartSettings" class="col s4 m3">
                        <div>
                            <h6>{{ chart.name }}</h6>
                        </div>
                        <label>
                            <input type="checkbox" :ref="'setting:'+chart.chartid" :name="chart.chartid+':enabled'" :checked="chart.enabled" :placeholder="chart.enabled" :disabled="plevel>0">
                            <span>Enabled</span>
                        </label>
                    </div>
                </div>
            </div>


            <div class="divider"></div>
            <div class="section" v-if="!currentSettingsPending">
                <h6>Custom charts</h6>
                <div>
                    <div v-for="chart in currentSettings.customChartSettings" class="row">
                        <div class="col s12 m12">
                            <div class="row">
                                <h6>{{ chart.name }}</h6>
                            </div>
    
                            <div class="row" style="gap: 10px;">
                                <div class="col s12 m1">
                                    <label>
                                        <input type="checkbox" :ref="'setting:customchart:'+chart.chartid+':enabled'" :name="chart.chartid+':enabled'" :checked="chart.enabled" :placeholder="chart.enabled" :disabled="plevel>0">
                                        <span>Enabled</span>
                                    </label>
                                </div>
                                <div class="col s12 m1">
                                    <label for="website">Type</label>
                                    <select class="browser-default" :ref="'setting:customchart:'+chart.chartid+':type'">
                                        <option value="pie" :selected="chart.type==='pie'">Pie</option>
                                        <option value="line" :selected="chart.type==='line'">Line</option>
                                    </select>
                                </div>                                
                                <div class="col s12 m3">
                                    <label for="website">Label</label>
                                    <input type="url" :placeholder="chart.label" :ref="'setting:customchart:'+chart.chartid+':label'">
                                </div>
                                <div class="col s12 m6">
                                    <label for="website">Name</label>
                                    <input type="url" :placeholder="chart.name" :ref="'setting:customchart:'+chart.chartid+':name'">
                                </div>

                                <div class="col s12 m6">
                                    <div class="waves-effect waves-light btn red modal-trigger" :data-target="'delCustomModal-'+chart.chartid"><i class="material-icons left">delete_forever</i>Delete chart</div>
                                </div>
                            </div>
                        </div>

                        <div :id="'delCustomModal-'+chart.chartid" :ref="'delCustomModal-'+chart.chartid" class="modal hide">
                            <div class="modal-content">
                                <h4>Confirm deletion of {{ chart.name }}</h4>
                            </div>
                            <div class="modal-footer">
                                <div>
                                    <div class="modal-close waves-effect waves-light btn left">Cancel</div>
                                    <div class="modal-close waves-effect waves-light btn red accent-3 right" :chartid="chart.chartid" @click="confirmedCustomDelete">Delete forever (really!)<i class="material-icons left">delete_forever</i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="divider"></div>
            <div class="section">
                <div class="row" style="gap: 10px;">
                    <div class="col s6 m2">
                        <div class="waves-effect waves-light btn modal-trigger" data-target="importModal1"><i class="material-icons left">import_export</i>Import/export data</div>
                    </div>
                    <div class="col s6 m2">
                        <div class="waves-effect waves-ight btn modal-trigger" data-target="keyModal1"><i class="material-icons left">keygen</i>API key</div> 
                    </div>
                    <div class="col s3 m2">
                        <div class="waves-effect waves-light btn" @click="sync">Sync<i class="material-icons left">autorenew</i></div>
                    </div>
                    <div class="col s3 m2">
                        <div class="waves-effect waves-light btn" @click="save">Save<i class="material-icons left">save</i></div>
                    </div>
                    <div class="col s6 m2">
                        <div class="waves-effect waves-light btn red modal-trigger" data-target="delModal1"><i class="material-icons left">delete_forever</i>Delete all data</div>
                    </div>
                </div>
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
            importExportMode:"",
            plevel: 0
        }
    },
    async mounted() {
        if (!await this.$auth.canSeeBot(this.$route.params.id, true)) return await navigateTo(this.$route.fullPath.substring(0, this.$route.fullPath.lastIndexOf('/')))
        const { data: plevel } = await useFetch(`/api/user/${this.$auth.getUser().id}`, {
            pick: ['plevel']
        })
        this.plevel=plevel.value

        this.botid = this.$route.params.id

        const {data: botSettingsJson, pending} = await useFetch(`/api/bots/${this.$route.params.id}/settings/get`)

        this.currentSettingsPending = pending.value
        this.currentSettings = botSettingsJson.value

        this.$M.FormSelect.init(this.$refs.importExportSelector)
        this.$M.FormSelect.init(this.$refs.importSourceSelector)

        await this.sleep(10)
        Object.keys(this.$refs).filter(r=>r.toLocaleLowerCase().includes("moda")).forEach(ref => {
            const mRef = Array.isArray(this.$refs[ref]) ? this.$refs[ref][0] : this.$refs[ref]
            this.$M.Modal.init(mRef, {
                onOpenStart: () => mRef.classList.remove("hide")
            })
        })
    },
    methods: {
        async sleep(delay){
            return new Promise(resolve => setTimeout(resolve, delay));
        },
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
        async confirmedCustomDelete(a){
            this.$M.toast({text: 'Deleting'})
            const {error} = await useFetch(() => `/api/bots/${this.botid}/settings/deleteCustomChart`, {
                method: 'delete',
                body: {
                    chartid: a.target.getAttribute("chartid")
                }
            });
            this.$M.toast({text: error.value? 'Error deleting' : 'Deleted'})
        },
        async save(){
            this.$M.toast({text: 'Saving'})

            const settings = {}
            Object.keys(this.$refs).filter(a=>a.startsWith("setting:")).forEach(a=>{
                const thisRef = Array.isArray(this.$refs[a]) ? this.$refs[a][0] : this.$refs[a]

                const settingName = a.replace("setting:", "")
                const settingNameParts = settingName.split(":")

                switch(settingNameParts.length-1){
                    case 0: {
                        settings[settingName] = this.inputTypeToValue(thisRef, thisRef.type)
                    }
                    break;
                    case 2: {
                        if (!settings[settingNameParts[0]]) settings[settingNameParts[0]] = {}
                        if (!settings[settingNameParts[0]][settingNameParts[1]]) settings[settingNameParts[0]][settingNameParts[1]] = {}
                        settings[settingNameParts[0]][settingNameParts[1]][settingNameParts[2]] = this.inputTypeToValue(thisRef, thisRef.type)
                    }
                    break;
                }            
            })

            const {error} = await useFetch(() => `/api/bots/${this.botid}/settings/set`, {
                method: 'post',
                body: settings
            })

            this.$M.toast({text: error.value? 'Error saving' : 'Saved'})
        },
        inputTypeToValue(input, type){
            switch (type) {
                case "checkbox": {
                    return input.checked
                }
                break;
                default: {
                    return input.value
                }
            }
        }
    }
}
</script>
