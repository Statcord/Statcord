<template>
    <UContainer>
        <UForm :state="state" class="space-y-4" @submit="save">
            <h6>Access control</h6>
            <UFormField label="Public" name="public">
                <USwitch v-model="state.public" icon="i-heroicons-eye" />
            </UFormField>
            <UFormField label="NSFW" name="nsfw">
                <USwitch v-model="state.nsfw" icon="i-heroicons-eye" />
            </UFormField>
            <UFormField label="Custom URL" name="customurl">
                <UInput v-model="state.customurl" @up="cusURLChanged" :placeholder="domain+'/bots/'+route.params.id" type="url" :disabled="plevel==0" />
            </UFormField>
            <UButton label="Check" :disabled="plevel==0" @click="checkCusUrl"></UButton>
            <USeparator />

            <h6>Bot Description</h6>
            <UFormField label="Short description" name="shortDesc">
                <UInput v-model="state.shortdesc" type="text"/>
            </UFormField>
            <USeparator />

            <h6>Add additional links (optional)</h6>
            <UFormField label="GitHub" name="github">
                <UInput v-model="state.github" type="url" />
            </UFormField>
            <UFormField label="Website" name="website">
                <UInput v-model="state.website" type="url" />
            </UFormField>
            <UFormField label="Support server" name="supportserver">
                <UInput v-model="state.supportserver" type="url" />
            </UFormField>
            <UFormField label="Donation link" name="donations">
                <UInput v-model="state.donations" type="url" />
            </UFormField>
            <USeparator />

            <h6>Defualt charts</h6>
            <UFormField v-for="chart in state.default" :label="chart.name" :name="chart.chartid">
                <USwitch v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel==0"/>
            </UFormField>
            <USeparator />

            <h6>Command charts</h6>
            <UFormField v-for="chart in state.commands" :label="chart.name" name="donations">
                <USwitch v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel==0"/>
            </UFormField>
            <USeparator />

            <h6>Custom charts</h6>
            <div v-for="chart in state.custom">
                <h6>{{ chart.name }}</h6>
                <UFormField v-for="chart in state.commands" :label="chart.name" name="donations">
                    <USwitch v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel==0"/>
                </UFormField>
                <UInputMenu v-model="chart.type" :options="['Pie', 'Line']" />

                <UFormField :label="chart.name" name="Label">
                    <UInput v-model="chart.label" type="text"/>
                </UFormField>

                <UFormField  :label="chart.name" name="Name">
                    <UInput v-model="chart.name" type="text"/>
                </UFormField>
                <DeleteCustomChart :chartName="chart.name" :chartid="chart.chartid"></DeleteCustomChart>
            </div>

            <USeparator />
            <UButton type="submit" icon="i-heroicons-check">Save</UButton>
            <UButton label="API key" icon="i-heroicons-key" @click="keyIsOpen = true" />
            <UButton label="Sync" icon="i-heroicons-arrow-path" @click="sync" />                 
            <UButton label="Delete all data" color="red" icon="i-heroicons-trash" @click="deleteIsOpen = true" />
        </UForm>
    </UContainer>

    <UModal v-model="keyIsOpen">
        <div class="p-4 bg-gray-800 text-gray-300 font-medium">
            <div class="modal-content">
                <h4>API key</h4>
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
const keyIsOpen = ref(false)
const deleteIsOpen = ref(false)

const { $authRequest } = useNuxtApp()
const route = useRoute()
const toast = useToast()
const domain = useRuntimeConfig().public.domain

const {userInfo} = await $authRequest("/api/session/")
if (!userInfo) await navigateTo($genOauthUrl(route.fullPath), {external: true});

const bot = await $authRequest(`/api/bots/${route.params.id}/`)
if (bot === "404") throw createError({
    statusCode: 404,
    message: 'Bot not found'
})
if (bot === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to access this bot'
})

const currentSettings = await $authRequest(`/api/bots/${route.params.id}/settings/get/`)
if (currentSettings === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to access this bot'
})

const {plevel} = await $authRequest(`/api/user/${bot.ownerid}/`)

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

async function confirmedDelete(){
    const {error} = await useFetch(() => `/api/bots/delete/`, {
        method: 'delete',
        body: {id: route.params.id}
    })
    if (!error.value) {
        await navigateTo(`/users/${bot.ownerid}`)
    }
}

async function checkCusUrl(){
    if (!state.customurl) return toast.add({title: 'Enter A URL'})

    const {error} = await useFetch(() => `/api/bots/${route.params.id}/settings/checkCustomURL/`, {
        method: 'post',
        body: state.customurl
    })

// toast.add({title: error.value? 'Error saving' : 'Saved'})
}

async function save(data){
    const {error} = await useFetch(() => `/api/bots/${route.params.id}/settings/set/`, {
        method: 'post',
        body: data.data
    })

    toast.add({title: error.value? 'Error saving' : 'Saved'})
}

async function sync() {
    const ajaxdata = await $fetch(`/api/bots/${route.params.id}/settings/sync/`, {
        method: 'post',
    }).catch(console.error);

    toast.add({title: ajaxdata ? 'Synced' : 'An error has occurred'})
}
</script>

<script>
export default {
    name: 'manageBot',
    data() {
        return {
            apiKey: undefined
        }
    },
    methods: {
        async reGenKey() {
            const {data} = await useFetch(() => `/api/bots/${this.$route.params.id}/settings/genKey/`, {
                method: 'post'
            })
            if (data.value?.key) {
                this.apiKey = data.value.key
            }
        },
        copyKey() {
            navigator.clipboard.writeText(this.apiKey)
        }
    }
}
</script>
