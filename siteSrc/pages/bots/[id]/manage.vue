<template>
    <UContainer>
        <form action="#">
            <div class="section">
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
                    <input disabled type="url" :placeholder="host + '/bots/' + route.params.id" ref="setting:customurl">
                  </div>
                  <div class="col s12 m1">
                    <div class="waves-effect waves-light btn-large right disabled">Check</div>
                  </div>
                </div>
            </div>

            <UDivider />
            <div class="section">
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

            <UDivider />
            <div class="section">
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

            <UDivider />
            <div class="section">
                <h6>Defualt charts</h6>
                <div class="row">
                    <div v-for="chart in currentSettings.default" class="col s4 m3">
                        <div>
                            <h6>{{ chart.name }}</h6>
                        </div>
                        <label>
                            <input type="checkbox" :ref="'setting:charts:defualt:'+chart.chartid" :name="chart.chartid+':enabled'" :checked="chart.enabled" :placeholder="chart.enabled" :disabled="plevel>0">
                            <span>Enabled</span>
                        </label>
                    </div>
                </div>
            </div>

            <UDivider />
            <div class="section">
                <h6>Command charts</h6>
                <div class="row">
                    <div v-for="chart in currentSettings.commands" class="col s4 m3">
                        <div>
                            <h6>{{ chart.name }}</h6>
                        </div>
                        <label>
                            <input type="checkbox" :ref="'setting:charts:commands:'+chart.chartid" :name="chart.chartid+':enabled'" :checked="chart.enabled" :placeholder="chart.enabled" :disabled="plevel>0">
                            <span>Enabled</span>
                        </label>
                    </div>
                </div>
            </div>

            <UDivider />
            <div class="section">
                <h6>Custom charts</h6>
                <div>
                    <div v-for="chart in currentSettings.custom" class="row">
                        <div class="col s12 m12">
                            <div class="row">
                                <h6>{{ chart.name }}</h6>
                            </div>
    
                            <div class="row" style="gap: 10px;">
                                <div class="col s12 m1">
                                    <label>
                                        <input type="checkbox" :ref="'setting:charts:custom:'+chart.chartid+':enabled'" :name="chart.chartid+':enabled'" :checked="chart.enabled" :placeholder="chart.enabled" :disabled="plevel>0">
                                        <span>Enabled</span>
                                    </label>
                                </div>
                                <div class="col s12 m1">
                                    <label for="website">Type</label>
                                    <select class="browser-default" :ref="'setting:charts:custom:'+chart.chartid+':type'">
                                        <option value="pie" :selected="chart.type==='pie'">Pie</option>
                                        <option value="line" :selected="chart.type==='line'">Line</option>
                                    </select>
                                </div>                                
                                <div class="col s12 m3">
                                    <label for="website">Label</label>
                                    <input type="url" :placeholder="chart.label" :ref="'setting:charts:custom:'+chart.chartid+':label'">
                                </div>
                                <div class="col s12 m6">
                                    <label for="website">Name</label>
                                    <input type="url" :placeholder="chart.name" :ref="'setting:charts:custom:'+chart.chartid+':name'">
                                </div>

                                <div class="col s12 m6">
                                    <DeleteCustomChart :chartName="chart.name" :chartid="chart.chartid"></DeleteCustomChart>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UDivider />
            <div class="section">
                <div class="row" style="gap: 10px;">
                    <div class="col s6 m2">
                        <UButton label="Export data" icon="i-heroicons-arrows-up-down" @click="exportIsOpen = true" />
                    </div>
                    <div class="col s6 m2">
                        <UButton label="API key" icon="i-heroicons-key" @click="keyIsOpen = true" />
                    </div>
                    <div class="col s3 m2">
                        <UButton label="Sync" icon="i-heroicons-arrow-path" @click="sync" />
                    </div>
                    <div class="col s3 m2">
                        <UButton label="Save" icon="i-heroicons-check" @click="save" />
                    </div>
                    <div class="col s6 m2">
                        <UButton label="Delete all data" color="red" icon="i-heroicons-trash" @click="deleteIsOpen = true" />
                    </div>
                </div>
            </div>
        </form>
    </UContainer>

    <UModal v-model="exportIsOpen">
        <div class="p-4 bg-gray-800 text-gray-300 font-medium">
            <div class="modal-content">
                <h4>Export</h4>
                <span>Download a copy of your data</span>
            </div>

            <div>
                <div class="grid grid-cols-6 gap-4">
                    <div class="col-start-1 col-end-3">
                        <UButton label="Close" @click="exportIsOpen = false" />
                    </div>
                    <div class="col-end-7 col-span-2">
                        <UButton label="Download" icon="i-heroicons-arrow-down-tray" @click="downloadData" />
                    </div>
                </div>
            </div>
        </div>
    </UModal>

    <UModal v-model="keyIsOpen">
        <div class="p-4 bg-gray-800 text-gray-300 font-medium">
            <div class="modal-content">
                <h4>API key</h4>
                <span>Download a copy of your data</span>
            </div>

            <div v-if="apiKey">
                <input type="text" disabled :value="apiKey">
                <UButton label="Copy" icon="i-heroicons-document-duplicate" @click="copyKey" />
            </div>

            <div>
                <div class="grid grid-cols-6 gap-4">
                    <div class="col-start-1 col-end-3">
                        <UButton label="Close" @click="keyIsOpen = false" />
                    </div>
                    <div class="col-end-7 col-span-2">
                        <UButton label="Regenerate API key" icon="i-heroicons-arrow-path" @click="reGenKey" />
                    </div>
                </div>
            </div>
        </div>
    </UModal>

    <UModal v-model="deleteIsOpen">
        <div class="p-4 bg-gray-800 text-gray-300 font-medium">
            <div class="modal-content">
                <h4>Confirm data deletion</h4>
            </div>
            <div>
                <div class="grid grid-cols-6 gap-4">
                    <div class="col-start-1 col-end-3">
                        <UButton label="Close" @click="deleteIsOpen = false" />
                    </div>
                    <div class="col-end-7 col-span-2">
                        <UButton label="Delete forever (really!)" color="red" icon="i-heroicons-trash" @click="confirmedDelete" />
                    </div>
                </div>
            </div>
        </div>
    </UModal>
</template>

<script setup>
const exportIsOpen = ref(false)
const keyIsOpen = ref(false)
const deleteIsOpen = ref(false)


import { useRoute } from 'vue-router';
const { $authRequest } = useNuxtApp()
const route = useRoute()

const bot = await $authRequest(`/api/bots/${route.params.id}`)
if (bot === "404") throw createError({
    statusCode: 404,
    message: 'Bot not found'
})
if (bot === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to access this bot'
})

const currentSettings = await $authRequest(`/api/bots/${route.params.id}/settings/get`)
if (currentSettings === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to access this bot'
})

useSeoMeta({
    themeColor: "#0080F0",
    title: () =>`Manage ${bot?.username}`,
    ogTitle: () => `Manage ${bot?.username}`,
    description:  () => `Manage ${bot?.username} on Statcord.`,
    ogDescription:  () => `Manage ${bot?.username} on Statcord.`,
    ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
    twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
    twitterCard: 'summary',
    ogUrl: () => `https://statcord.com/${route.params.id}/manage`,
    twitterTitle: () =>`Manage ${bot?.username}`,
    twitterDescription:  () => `Manage ${bot?.username} on Statcord.`,
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
    name: 'manageBot',
    data() {
        const config = useRuntimeConfig()
        return {
            host: config.public.domain,
            apiKey: undefined,
            plevel: 0,
            userID: ""
        }
    },
    async mounted() {        
        const {userInfo} = await this.$authRequest("/api/session")
        if (!userInfo) await navigateTo(this.$genOauthUrl(this.$route.fullPath), {external: true});

        this.userID = userInfo.id

        const {plevel} = await this.$authRequest(`/api/user/${userInfo.id}`)
        this.plevel=plevel
    },
    methods: {
        async downloadData(){
            const {data} = await useFetch(`/api/bots/${this.$route.params.id}/stats/export`)

            const a = document.createElement("a");
            a.href = `data:text/plain;base64,${data.value}`;
            a.download = `Statcord_data_export_bot_${this.$route.params.id}.json`;
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
            this.$toast.add({ title: 'Syncing' })
            const ajaxdata = await $fetch(`/api/bots/${this.$route.params.id}/settings/sync`, {
                method: 'post',
            }).catch(console.error);
            if (ajaxdata) this.$toast.add({ title: 'Synced' })
            else this.$toast.add({title: 'An error has occurred'})
        },
        async confirmedDelete() {
            const {error} = await useFetch(() => `/api/bots/delete`, {
                method: 'delete',
                body: {id: this.$route.params.id}
            })
            if (!error.value) {
                await navigateTo(`/users/${this.userID}`)
            }
        },
        async save(){
            this.$toast.add({title: 'Saving'})

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
                    case 3: {
                        if (!settings[settingNameParts[0]]) settings[settingNameParts[0]] = {}
                        if (!settings[settingNameParts[0]][settingNameParts[1]]) settings[settingNameParts[0]][settingNameParts[1]] = {}
                        if (!settings[settingNameParts[0]][settingNameParts[1]][settingNameParts[2]]) settings[settingNameParts[0]][settingNameParts[1]][settingNameParts[2]] = {}
                        settings[settingNameParts[0]][settingNameParts[1]][settingNameParts[2]][settingNameParts[3]] = this.inputTypeToValue(thisRef, thisRef.type)
                    }
                    break;
                }            
            })

            const {error} = await useFetch(() => `/api/bots/${this.$route.params.id}/settings/set`, {
                method: 'post',
                body: settings
            })

            this.$toast.add({title: error.value? 'Error saving' : 'Saved'})
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
