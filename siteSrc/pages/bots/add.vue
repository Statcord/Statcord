<template>
  <UContainer>
    <h4>Add your bot</h4>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="submitBot">

      <h6>Basic bot info</h6>
      <UFormGroup label="Enter the Bot ID" name="botid">
        <UInput v-model="state.botid" placeholder="961433265879801936" @change="botIdUpdated" pattern="[0-9]{17,21}" />
      </UFormGroup>
      <UFormGroup label="Invite" name="invite">
        <UInput v-model="state.invite" type="url" />
      </UFormGroup>

      <UDivider />

      <h6>Access control</h6>
      <UFormGroup label="Public" name="public">
        <UToggle v-model="state.public" icon="i-heroicons-eye" />
      </UFormGroup>
      <UFormGroup label="NSFW" name="nsfw">
        <UToggle v-model="state.nsfw" icon="i-heroicons-eye" />
      </UFormGroup>

      <UDivider />

      <UFormGroup label="Custom URL" name="customurl">
        <UInput v-model="state.customurl" :placeholder="domain+'/bots/'+botid" type="url" disabled />
      </UFormGroup>
      <UButton label="Check" disabled></UButton>

      <UDivider />

      <h6>Bot Description</h6>
      <UFormGroup label="Short description" name="shortDesc">
        <UInput v-model="state.shortDesc" type="text"/>
      </UFormGroup>
      <UFormGroup label="Long description (Markdown ONLY)" name="longDesc">
        <UTextarea v-model="state.longDesc"/>
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
    longDesc: undefined,
    github: undefined,
    website: undefined,
    supportserver: undefined,
    donations: undefined
  })

  const schema = z.object({
    botid: z.string().cuid2(),
    invite: z.string().url(),
    nsfw: z.boolean(),
    public: z.boolean(),
    customurl: z.string().url().optional(),
    shortDesc: z.string(),
    longDesc: z.string(),
    github: z.string().url().optional(),
    website: z.string().url().optional(),
    supportserver: z.string().url().optional(),
    donations: z.string().url().optional()
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
</script>
<script>
  export default {
    name: 'addBot',
    data() {
      return {
        botid: "961433265879801936"
      };
    },
    methods: {
      async submitBot(a) {
        const { error } = await useFetch(() => `/api/bots/add/`, {
          method: 'post',
          body: a.data
        })
        if (error.value) this.$toast.add({title: "error adding bot"})
        else await navigateTo(`/bots/${this.$refs.botid.value}`);
      },
      botIdUpdated(a){
        if (a==="") return this.botid = "685166801394335819"
        this.botid = a
      }
    }
  }
</script>