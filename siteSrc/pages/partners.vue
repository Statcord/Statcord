<template>
  <UContainer>
    <div class="grid md:grid-cols-1 sm:grid-cols-1 justify-items-center">
      <div class="max-w-sm overflow-hidden shadow-md rounded-xl ">
        <nuxt-img class="w-full" alt="SafeGuard Hosting's logo" src="/img/partners/SafeGuard/logo_-_text_under.svg" />
        <div class="px-4 py-4">
          <UContainer>
            <div>
              <p>Welcome to SafeGuard Hosting, a reliable and secure web hosting company that provides a wide range of hosting solutions for businesses and individuals.</p>
            </div>
          </UContainer>
        </div>
        <div class="bg-blue-400 text-center text-xl cursor-pointer">
          <NuxtLink to="https://safeguardhosting.ca/aff.php?aff=17&src=statcord" target="_blank" rel="noopener noreferrer">Explore Services</NuxtLink>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
  useSeoMeta({
    themeColor: "#0080F0",
    description: "Check out our amazing partners.",
    ogDescription: "Check out our amazing partners.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterDescription: "Check out our amazing partners.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })
</script>
<script>
  export default {
    name: 'partners'
  }
</script>
