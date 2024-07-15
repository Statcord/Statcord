<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <UIcon v-if="!open" name="i-heroicons-bars-3" />
            <UIcon v-else name="i-heroicons-x-mark" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <router-link to="/" class="flex flex-shrink-0 items-center">
            <nuxt-img class="h-8 w-auto" alt="Statcord logo" src="img/logo.png" />
          </router-link>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <router-link v-for="item in navigation" :key="item.name" :to="item.href" :class="[item.href===route.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="item.href===route.path ? 'page' : undefined">{{item.name}}</router-link>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <NuxtLink v-if="!user" :to="oauthUrl" replace>Login</NuxtLink>
          <Menu v-else as="div" class="relative ml-3">
            <div>
              <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <nuxt-img class="h-8 w-8 rounded-full" :alt="user.username" :src="`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${(user.avatar?.startsWith('a_')?'gif':'webp')}`" :placeholder="'https://cdn.discordapp.com/embed/avatars/'+((user.id??0) >>> 22) % 5+'.png?size=512'" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <router-link :to="'/users/'+user.id" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">User</router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <span @click="logout" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Logout</span>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.href===route.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.href===route.path ? 'page' : undefined">{{ item.name }}</DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>


<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const navigation = [
    { name: 'Docs', href: '/docs' },
    { name: 'Support', href: '/support' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Setup guide', href: '/guide' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Partners', href: '/partners' }
  ]

  const headers = useRequestHeaders(['cookie'])

  const { data: userFetch } = await useAsyncData(async () => {
    const [user] = await Promise.all([
        $fetch(`/api/oauth/user`, { headers })
    ])
    return user
  })

  const user = userFetch.value
  console.log(user)
</script>


<script>
export default {
  name: 'navbar',
  data() {
    return {
      oauthUrl: this.$genOauthUrl(this.$route.fullPath),
    }
  },
  async mounted() {
    this.$M.Sidenav.init(this.$refs.sidenav)

    if (this.$refs.dropdownContent) this.$M.Dropdown.init(this.$refs.dropdown, { coverTrigger: false })
  },
  methods: {
    async logout(){
      this.$authRequest('/api/session', {
        method: "DELETE"
      })
      await navigateTo("/", {"external": true})
    }
  },
  watch: {
    $route(route){
      this.oauthUrl = this.$genOauthUrl(route.fullPath)
    }
  }
}
</script>
