<template>
  <footer class="relative bg-gray-800 pt-8 pb-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap text-left lg:text-left">
        <div class="w-full lg:w-6/12 px-4">
          <div class="mt-6 lg:mb-0 mb-6 text-white">
            <img src="~/assets/img/logo.png" loading="lazy" alt="Statcord logo" style="max-width: 40%;">
            <span>© {{year}} </span> <NuxtLink to="https://numselli.xyz" target="_blank" rel="noopener noreferrer" class="underline">numselli</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'footerbar',
    data(){
      return {
        year: new Date().getFullYear()
      }
    }
  }
</script>