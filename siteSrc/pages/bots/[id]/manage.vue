<template>
    <UContainer>
        <UForm :state="state" class="space-y-4" @submit="save">
            <h6>Access control</h6>
            <div class="grid md:grid-cols-3 gap-4">
                <UFormField label="Public" name="public">
                    <USwitch v-model="state.public" icon="i-heroicons-eye" />
                </UFormField>
                <UFormField label="NSFW" name="nsfw">
                    <USwitch v-model="state.nsfw" icon="i-heroicons-eye" />
                </UFormField>
                <UFormField label="Custom URL" name="customurl">
                    <UInput v-model="state.customurl" :placeholder="domain+'/bots/'+route.params.id" type="url" :disabled="plevel==0" />
                    <UButton label="Check" :disabled="plevel==0" @click="checkCusUrl" disabled></UButton>
                </UFormField>
            </div>
            <USeparator />

            <h6>Bot Description</h6>
            <UFormField label="Short description" name="shortDesc">
                <UInput v-model="state.shortdesc" type="text"/>
            </UFormField>
            <USeparator />

            <h6>Add additional links (optional)</h6>
            <div class="grid md:grid-cols-4 gap-4">
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
            </div>
            <USeparator />

            <h6>Defualt charts</h6>
            <div class="grid md:grid-cols-4 gap-4">
                <UFormField v-for="chart in state.default" :label="chart.name" :name="chart.chartid">
                    <USwitch v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel==0"/>
                </UFormField>
            </div>
            <USeparator />

            <h6>Command charts</h6>
            <div class="grid md:grid-cols-4 gap-4">
                <UFormField v-for="chart in state.commands" :label="chart.name" name="donations">
                    <USwitch v-model="chart.enabled" icon="i-heroicons-eye" :disabled="plevel==0"/>
                </UFormField>
            </div>
            <USeparator />

            <h6>Custom charts</h6>
            <div class="grid md:grid-cols-4 gap-4">
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
            </div>
            <USeparator />

            <div class="grid md:grid-cols-4 gap-4">
                <UButton type="submit" icon="i-heroicons-check">Save</UButton>
                <UButton label="API key" icon="i-heroicons-key" @click="keyIsOpen = true" />
                <UButton label="Sync" icon="i-heroicons-arrow-path" @click="sync" />
                <UButton label="Delete all data" color="error" icon="i-heroicons-trash" @click="deleteIsOpen = true" />
            </div>
        </UForm>
    </UContainer>

    <UModal v-model:open="keyIsOpen" title="API key" close-icon="i-heroicons-x-mark">
        <template #body>
            <div v-if="apiKey">
                <input type="text" disabled :value="apiKey">
                <UButton label="Copy" icon="i-heroicons-document-duplicate" @click="copyKey" />
            </div>
    
            <div>
                <div class="col-end-7 col-span-2">
                    <UButton label="Regenerate API key" icon="i-heroicons-arrow-path" @click="reGenKey" />
                </div>
            </div>
        </template>
    </UModal>

    <UModal v-model:open="deleteIsOpen" title="Confirm data deletion" close-icon="i-heroicons-x-mark">
        <template #body>
            <div class="col-end-7 col-span-2">
                <UButton label="Delete forever (really!)" color="error" icon="i-heroicons-trash" @click="confirmedDelete" />
            </div>
        </template>
    </UModal>
</template>

<script setup>
const keyIsOpen = ref(false)
const deleteIsOpen = ref(false)
const apiKey = ref()

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

    toast.add({title: error.value ? 'Error saving' : 'Saved'})
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

async function reGenKey() {
    const {data} = await useFetch(() => `/api/bots/${route.params.id}/settings/genKey/`, {
        method: 'post'
    })
    if (data.value?.key) {
        apiKey.value = data.value.key
    }
}

async function copyKey() {
    navigator.clipboard.writeText(apiKey.value)
}
</script>