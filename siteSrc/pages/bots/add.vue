<template>
  <UContainer>
    <h4>Add your bot</h4>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="submitBot">

      <h6>Basic bot info</h6>
      <UFormField label="Enter the Bot ID" name="botid">
        <UInput v-model="state.botid" placeholder="961433265879801936" pattern="[0-9]{17,21}" />
      </UFormField>
      <UFormField label="Invite" name="invite">
        <UInput v-model="state.invite" type="url" />
      </UFormField>

      <USeparator />

      <h6>Access control</h6>
      <UFormField label="Public" name="public">
        <USwitch v-model="state.public" icon="i-heroicons-eye" />
      </UFormField>
      <UFormField label="NSFW" name="nsfw">
        <USwitch v-model="state.nsfw" icon="i-heroicons-eye" />
      </UFormField>

      <USeparator />

      <UFormField label="Custom URL" name="customurl">
        <UInput v-model="state.customurl" :placeholder="domain+'/bots/'+botid" type="url" disabled />
      </UFormField>
      <UButton label="Check" disabled></UButton>

      <USeparator />

      <h6>Bot Description</h6>
      <UFormField label="Short description" name="shortDesc">
        <UInput v-model="state.shortDesc" type="text"/>
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

      <UButton type="submit">
        Add bot
      </UButton>
    </UForm>
  </UContainer>
</template>

<script setup>
  import { z } from 'zod'

  const { $authRequest, $genOauthUrl } = useNuxtApp()
  const route = useRoute()

  const domain = useRuntimeConfig().public.domain

  const sessionFetch = await $authRequest(`/api/session/`)
  if (!sessionFetch.accessToken) await navigateTo($genOauthUrl(route.fullPath), {external: true});

  const state = reactive({
    botid: undefined,
    invite: undefined,
    nsfw: false,
    public: true,
    customurl: undefined,
    shortDesc: undefined,
    github: undefined,
    website: undefined,
    supportserver: undefined,
    donations: undefined
  })

  const schema = z.object({
    botid: z.string().cuid2(),
    invite: z.url(),
    nsfw: z.boolean(),
    public: z.boolean(),
    customurl: z.url().optional(),
    shortDesc: z.string(),
    github: z.url().optional(),
    website: z.url().optional(),
    supportserver: z.url().optional(),
    donations: z.url().optional()
  })

  useSeoMeta({
    themeColor: "#0080F0",
    title: 'Add bot',
    description: "Start tracking your Discord bot's statistics using Statcord.",
    ogTitle: 'Add bot',
    ogDescription: "Start tracking your Discord bot's statistics using Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterTitle: 'Add bot',
    twitterDescription: "Start tracking your Discord bot's statistics using Statcord.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })

  async function submitBot(a) {
    const { error } = await useFetch(() => `/api/bots/add/`, {
      method: 'post',
      body: a.data
    })
    if (error.value) toast.add({title: "error adding bot"})
    else await navigateTo(`/bots/${state.botid}`);
  }
</script>