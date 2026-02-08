<template>
  <UContainer>

    <UUser :name="user.username" :description="user.aboutme" orientation="horizontal" :avatar="{src: user.avatarURL}" size="3xl">
      <template #description>
        <div>
          {{ user.aboutme }}
        </div>
        <div class="">
          <div v-if="user.website">
            <openLink icon="link" name="Website" :url="user.website"/>
          </div>
        </div>
      </template>
    </UUser>

    <USeparator class="pt-2 pb-4"/>

    <h1 class="mt-2 text-3xl font-medium tracking-tight">Bots</h1>
    <USeparator class="pb-2"/>
    <botlist :botsProvided="botListBots"></botlist>
  </UContainer>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  const { $authRequest } = useNuxtApp()
  const route = useRoute()

  const userFetch = await $authRequest(`/api/user/${route.params.userID}/`)
  if (userFetch === "404") throw createError({
    statusCode: 404,
    message: 'User not found'
  })
  if (userFetch === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to veiw this user'
  })
  
  const user = {
    ...userFetch,
    avatarURL: `https://cdn.discordapp.com/avatars/${userFetch.avatar ? `${route.params.userID}/${userFetch.avatar}.webp${bot.avatar?.startsWith('a_')?'?animated=true':''}`: `${(route.params.userID >>> 22) % 5}.png`}`
  }
  
  const botListBotsFetch = await $authRequest(`/api/user/${route.params.userID}/bots/`)
  if (botListBotsFetch === "404") throw createError({
    statusCode: 404,
    message: 'User not found'
  })
  if (botListBotsFetch === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to veiw this user'
  })
  const botListBots = botListBotsFetch

  useSeoMeta({
    themeColor: "#0080F0",
    title: 'User profile',
    description: "View a users profile on Statcord.",
    ogTitle: 'User profile',
    ogDescription: "View a users profile on Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterTitle: 'User profile',
    twitterDescription: "View a users profile on Statcord.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })
</script>