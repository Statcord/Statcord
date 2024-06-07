<template>
  <div class="section">
    <div class="center-align">
      <h2>Partners</h2>
      <h6>Statcord wouldn't be possible without our amazing partners.</h6>
    </div>
    <div class="divider"></div>
  </div>

  <div class="section">
    <div class="row" style="gap:10px;">
      <div class="col s12 m2 offset-m5">
        <div class="card">
          <div class="card-image">
            <img src="~/assets/img/partners/SafeGuard/logo_-_text_under.svg">
          </div>
          <div class="card-content">
            <p>Welcome to SafeGuard Hosting, a reliable and secure web hosting company that provides a wide range of hosting solutions for businesses and individuals.</p>
          </div>
          <div class="card-action">
            <NuxtLink to="https://safeguardhosting.ca/aff.php?aff=17&src=statcord" target="_blank" rel="noopener noreferrer">Explore Services</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
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
