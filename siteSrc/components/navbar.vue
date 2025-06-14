<template>
  <UNavigationMenu :items="horizontalItems" class="w-full" content-orientation="vertical">
    <template #icon>
      <nuxt-img class="h-8 w-auto rounded-full" alt="Statcord logo" src="/img/logo.png" />
    </template>

    <template #user>
      <nuxt-img class="h-8 w-8 rounded-full" :alt="user.username" :src="`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${(user.avatar?.startsWith('a_')?'gif':'webp')}`" :placeholder="'https://cdn.discordapp.com/embed/avatars/'+((user.id??0) >>> 22) % 5+'.png?size=512'" />
    </template>
  </UNavigationMenu>
    
  <USlideover v-model:open="open" side="left">
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical"  />
    </template>
  </USlideover>
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

  const user = userFetch.value

  const mainItems = [
    { label: 'Docs', to: '/docs/' },
    { label: 'Support', to: '/support/' },
    { label: 'Privacy', to: '/privacy/' },
    { label: 'Setup guide', to: '/guide/' },
    { label: 'Pricing', to: '/pricing/' },
    { label: 'Partners', to: '/partners/' }
  ]

  const oauthUrl = ref($genOauthUrl(route.fullPath))
  const open = ref(false)
  const items = ref(mainItems)

  const horizontalItems = ref([
    [
      {
        icon: 'i-heroicons-bars-3',
        onSelect(){
          open.value=true
        },
        class: "md:hidden"
      }
    ],
    [
      {
        slot: "icon",
        to: '/'
      }
    ],
    [
      ...mainItems.map(i=>{return {
        ...i,
        class: "hidden md:inline"
      }})
    ],
    [
      user ? {
        label: 'User',
        slot: "user",
        children: [
          {
            label: 'User',
            to: `/users/${user.id}/`
          },
          {
            label: 'Add your bot',
            to: '/bots/add/'
          },
          {
            label: 'User Settings',
            to: `/users/${user.id}/settings/`
          },
          {
            label: 'Logout',
            class: "bg-red-500"
          },
        ]
      } : {
        label: "login",
        to: oauthUrl
      }
    ]
  ])

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