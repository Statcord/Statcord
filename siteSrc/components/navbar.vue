<template>
  <UHeader>
    <template #left>
      <ULink to="/">
        <nuxt-img class="h-8 w-auto rounded-full" alt="Statcord logo" src="/img/logo.png" />
      </ULink>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UNavigationMenu :items="userItems" contentOrientation="vertical" />
      <UColorModeSelect class="md:block hidden"/>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <UColorModeSelect />
    </template>
  </UHeader>
</template>


<script setup>
 const { $authRequest, $genOauthUrl } = useNuxtApp()

  const route = useRoute()

  const headers = useRequestHeaders(['cookie'])

  const { data: userFetch } = await useAsyncData(async () => {
    const [user] = await Promise.all([
        $fetch(`/api/oauth/user`, { headers })
    ])
    return user
  })

  const oauthUrl = ref($genOauthUrl(route.fullPath))

  const items = computed(() => [
    { label: 'Docs', to: '/docs/' },
    { label: 'Support', to: '/support/' },
    { label: 'Privacy', to: '/privacy/' },
    { label: 'Setup guide', to: '/guide/' },
    { label: 'Pricing', to: '/pricing/' },
    { label: 'Partners', to: '/partners/' }
  ])

  const userItems = [
    userFetch.value ? {
      label: userFetch.value.username,
      avatar: {
        src: `https://cdn.discordapp.com/avatars/${userFetch.value.id}/${userFetch.value.avatar}.webp?size=512${bot.avatar?.startsWith('a_')?'&animated=true':''}`,
        alt: `${userFetch.value.username}'s profile picture`
      },
      children: [
        {
          label: 'Profile',
          to: `/users/${userFetch.value.id}/`
        },
        {
          label: 'Add bot',
          to: '/bots/add/'
        },
        {
          label: 'Settings',
          to: `/users/${userFetch.value.id}/settings/`
        },
        {
          label: 'Logout',
          class: "bg-red-500",
          onSelect: logout
        },
      ]
    } : {
      label: "login",
      to: oauthUrl
    }
  ]

  watch(route, ()=>{
    oauthUrl.value = $genOauthUrl(route.fullPath)
    open.value = false
  })

  async function logout(){
    $authRequest('/api/session', {
      method: "DELETE"
    })
    await navigateTo("/", {"external": true})
  }
</script>