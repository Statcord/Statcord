<template>
  <UContainer>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Public">
        <USwitch v-model="state.public" icon="i-heroicons-eye" />
      </UFormField>

      <UFormField label="About Me">
        <UInput v-model="state.aboutme" icon="i-heroicons-book-open" />
      </UFormField>

      <UFormField label="Website">
        <UInput v-model="state.website" icon="i-heroicons-link" />
      </UFormField>

      <UButton type="submit" label="Save" icon="i-heroicons-check"/>

      <UButton label="Delete all data" color="red" icon="i-heroicons-trash" @click="deleteAllModalOpen = true" />
    </UForm>
    
    <UModal v-model:open="deleteAllModalOpen" title="Confirm data deletion">
      <template #footer>
        <UButton label="Delete forever (really!)" color="red" icon="i-heroicons-trash" @click="confirmedDelete" />
      </template>
    </UModal>
  </UContainer>
</template>

<script setup>
  const deleteAllModalOpen = ref(false)

  const { $authRequest, $genOauthUrl } = useNuxtApp()
  const route = useRoute()
  const toast = useToast()

  const oauthUrl = $genOauthUrl(route.fullPath)

  const {accessToken} = await $authRequest("/api/session/")
  if (!accessToken) await navigateTo(oauthUrl, {external: true});

  const profileInfo = await $authRequest(`/api/user/${route.params.userID}/`)
  if (profileInfo === "404") throw createError({
    statusCode: 404,
    message: 'User not found'
  })
  if (profileInfo === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to veiw this user'
  })

  const state = reactive({
    public: profileInfo.public,
    aboutme: profileInfo.aboutme,
    website: profileInfo.website
  })

  useSeoMeta({
    themeColor: "#0080F0",
    title: 'User settings',
    description: "Manage your user settings on Statcord.",
    ogTitle: 'User settings',
    ogDescription: "Manage your user settings on Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterTitle: 'User settings',
    twitterDescription: "Manage your user settings on Statcord.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })

  async function onSubmit(a){
    const {error} = await useFetch(() => `/api/user/${route.params.userID}/settings/set/`, {
      method: 'post',
      body: a.data
    })
    toast.add({title: error.value ? 'Error saving' : 'Saved'})
  }

  async function confirmedDelete() {
    const { error } = await useFetch(() => `/api/oauth/user/delete/`, {
      method: 'delete',
    })
    if (!error.value) {
      $authRequest('/api/session/', {
        method: "DELETE"
      })
      await navigateTo("/", {"external": true})
    }
  }
</script>
