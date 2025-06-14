<template>
  <footer class="relative pt-8 pb-6">
    <UCard variant="outline">
      <UContainer>
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap text-left lg:text-left">
            <div class="w-full lg:w-6/12 px-4">
              <div class="mt-6 lg:mb-0 mb-6">
                <nuxt-img class="h-8 w-auto rounded-full" alt="Statcord logo" src="/img/logo.png" />
                <span>© {{year}} </span> <NuxtLink to="https://numselli.xyz" target="_blank" class="underline">numselli</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </UCard>
  </footer>
</template>

<script setup>
  const year = new Date().getFullYear()
</script> 