<template>
  <UContainer>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Public">
        <UToggle v-model="state.public" icon="i-heroicons-eye" />
      </UFormGroup>

      <UFormGroup label="About Me">
        <UInput v-model="state.aboutme" icon="i-heroicons-book-open" />
      </UFormGroup>

      <UFormGroup label="Website">
        <UInput v-model="state.website" icon="i-heroicons-link" />
      </UFormGroup>

      <UButton type="submit" label="Save" icon="i-heroicons-check"/>

      <UButton label="Delete all data" color="red" icon="i-heroicons-trash" @click="deleteAllModalOpen = true" />
    </UForm>
    
    <UModal v-model="deleteAllModalOpen">
      <div class="p-4 bg-gray-800 text-gray-300 font-medium">
        <div>
          <h4>Confirm data deletion</h4>
        </div>
        <div>
          <div class="grid grid-cols-6 gap-4">
            <div class="col-start-1 col-end-3">
              <UButton label="Cancel" @click="deleteAllModalOpen = false" />
            </div>
            <div class="col-end-7 col-span-2">
              <UButton label="Delete forever (really!)" color="red" icon="i-heroicons-trash" @click="confirmedDelete" />
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </UContainer>
</template>

<script setup>
  const deleteAllModalOpen = ref(false)

  import { useRoute } from 'vue-router';
  const { $authRequest, $genOauthUrl } = useNuxtApp()
  const route = useRoute()
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
    aboutme: profileInfo.aboutme
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
</script>

<script>
export default {
  name: 'userSettings',
  data() {
    return {
    };
  },
  methods: {
    async confirmedDelete() {
      const { error } = await useFetch(() => `/api/oauth/user/delete/`, {
        method: 'delete',
      })
      if (!error.value) {
        this.$authRequest('/api/session/', {
          method: "DELETE"
        })
        await navigateTo("/", {"external": true})
      }
    },
    async onSubmit(a){
      const {error} = await useFetch(() => `/api/user/${this.$route.params.userID}/settings/set/`, {
        method: 'post',
        body: a.data
      })

      this.$toast.add({title: error.value ? 'Error saving' : 'Saved'})
    }
  }
}
</script>
