<template>
    <UContainer>
        <UForm :state="state" class="space-y-4" @submit="save">
            <h6>Access control</h6>
            <UFormGroup label="Public" name="public">
                <UToggle v-model="state.public" icon="i-heroicons-eye" />
            </UFormGroup>
            <UFormGroup label="NSFW" name="nsfw">
                <UToggle v-model="state.nsfw" icon="i-heroicons-eye" />
            </UFormGroup>
            <UFormGroup label="Custom URL" name="customurl">
                <UInput v-model="state.customurl" :placeholder="domain+'/bots/'+botid" type="url" disabled />
            </UFormGroup>
            <UButton label="Check" disabled></UButton>
            <UDivider />

            <h6>Bot Description</h6>
            <UFormGroup label="Short description" name="shortDesc">
                <UInput v-model="state.shortdesc" type="text"/>
            </UFormGroup>
            <UFormGroup label="Long description (Markdown ONLY)" name="longDesc">
                <UTextarea v-model="state.longdesc"/>
            </UFormGroup>
            <UDivider />

            <h6>Add additional links (optional)</h6>
            <UFormGroup label="GitHub" name="github">
                <UInput v-model="state.github" type="url" />
            </UFormGroup>
            <UFormGroup label="Website" name="website">
                <UInput v-model="state.website" type="url" />
            </UFormGroup>
            <UFormGroup label="Support server" name="supportserver">
                <UInput v-model="state.supportserver" type="url" />
            </UFormGroup>
            <UFormGroup label="Donation link" name="donations">
                <UInput v-model="state.donations" type="url" />
            </UFormGroup>
            <UDivider />

            <h6>Defualt charts</h6>
            <UFormGroup v-for="chart in state.default" :label="chart.name" :name="chart.chartid">
                <UToggle v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel>0"/>
            </UFormGroup>
            <UDivider />

            <h6>Command charts</h6>
            <UFormGroup v-for="chart in state.commands" :label="chart.name" name="donations">
                <UToggle v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel>0"/>
            </UFormGroup>
            <UDivider />

            <h6>Custom charts</h6>
            <div v-for="chart in state.custom">
                <h6>{{ chart.name }}</h6>
                <UFormGroup v-for="chart in state.commands" :label="chart.name" name="donations">
                    <UToggle v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel>0"/>
                </UFormGroup>
                <UInputMenu v-model="chart.type" :options="['Pie', 'Line']" />

                <UFormGroup :label="chart.name" name="Label">
                    <UInput v-model="chart.label" type="text"/>
                </UFormGroup>

                <UFormGroup  :label="chart.name" name="Name">
                    <UInput v-model="chart.name" type="text"/>
                </UFormGroup>
                <DeleteCustomChart :chartName="chart.name" :chartid="chart.chartid"></DeleteCustomChart>
            </div>

            <UDivider />
            <UButton type="submit" icon="i-heroicons-check">Save</UButton>
            <UButton label="Export data" icon="i-heroicons-arrows-up-down" @click="exportIsOpen = true" />
            <UButton label="API key" icon="i-heroicons-key" @click="keyIsOpen = true" />
            <UButton label="Sync" icon="i-heroicons-arrow-path" @click="sync" />                 
            <UButton label="Delete all data" color="red" icon="i-heroicons-trash" @click="deleteIsOpen = true" />
        </UForm>
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
import { useRoute } from 'vue-router';

const exportIsOpen = ref(false)
const keyIsOpen = ref(false)
const deleteIsOpen = ref(false)

const { $authRequest } = useNuxtApp()
const route = useRoute()
const domain = useRuntimeConfig().public.domain

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

const state = reactive(currentSettings)
</script>

<script>
export default {
    name: 'manageBot',
    data() {
        const config = useRuntimeConfig()
        return {
            apiKey: undefined,
            plevel: 0,
            userID: "",
            botid: this.$route.params.id
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
        async save(data){
            this.$toast.add({title: 'Saving'})
            console.log(data.data)

            const {error} = await useFetch(() => `/api/bots/${this.$route.params.id}/settings/set`, {
                method: 'post',
                body: data.data
            })

            this.$toast.add({title: error.value? 'Error saving' : 'Saved'})
        }
    }
}
</script>
