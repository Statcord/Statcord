<template>
  <div class="container">
    <h4>Add your bot</h4>
    <form>
      <div class="section">
        <h6>Basic bot info</h6>
        <div class="row">
          <div class="col s12 m6">
            <label for="botid">Enter the Bot ID</label>
            <input @input="botIdUpdated" type="text" ref="botid" placeholder="961433265879801936" pattern="[0-9]{17,21}" required>
          </div>

          <div class="col s12 m6">
            <label for="invite">Invite</label>
            <input required type="url" ref="invite" placeholder="">
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h6>Access control</h6>
        <div class="row">
          <div class="col s12 m12">
            <label>
              <input type="checkbox" checked placeholder="true" ref="public">
              <span>Public</span>
            </label>
          </div>

          <div class="col s12 m12">
            <label>
              <input type="checkbox" ref="nsfw">
              <span>NSFW</span>
            </label>
          </div>
        </div>

        <div class="row">
          <div class="col s12 m11">
            <label for="customurl">Custom URL</label>
            <input disabled type="url" :placeholder="host+'/bots/'+botid" ref="customurl">
          </div>
          <div class="col s12 m1">
            <div class="waves-effect waves-light btn-large right disabled">Check</div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h6>Bot Description</h6>
        <div class="row">
          <div class="col s12 m12">
            <label for="shortDesc">Short description</label>
            <input required type="text" ref="shortDesc" placeholder="">
          </div>

          <div class="col s12 m12">
            <label for="longDesc">Long description (Markdown ONLY)</label>
            <textarea required ref="longDesc" placeholder=""></textarea>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h6>Add additional links (optional)</h6>
        <div class="row">
          <div class="col s12 m6">
            <label for="github">GitHub</label>
            <input type="url" ref="github">
          </div>
          <div class="col s12 m6">
            <label for="website">Website</label>
            <input type="url" ref="website">
          </div>
        </div>

        <div class="row">
          <div class="col s12 m6">
            <label for="supportserver">Support server</label>
            <input type="url" ref="supportserver">
          </div>
          <div class="col s12 m6">
            <label for="donations">Donation link</label>
            <input type="url" ref="donations">
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <input type="submit" class="waves-effect waves-light btn right" @click.prevent="submitBot" value="Add bot">
      </div>
    </form>
  </div>
</template>

<script setup>
  const { $authRequest, $genOauthUrl } = useNuxtApp()
  const route = useRoute()

  const sessionFetch = await $authRequest(`/api/session`)
  if (!sessionFetch.accessToken) await navigateTo($genOauthUrl(route.fullPath), {external: true});

  useSeoMeta({
    themeColor: "#0080F0",
    title: 'Add bot',
    description: "Start tracking your Discord bot's statistics using Statcord.",
    ogTitle: 'Add bot',
    ogDescription: "Start tracking your Discord bot's statistics using Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterTitle: 'Add bot',
    twitterDescription: "Start tracking your Discord bot's statistics using Statcord.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })

  useHead({
    htmlAttrs: {
      lang: 'en'
    },
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/img/favicon.ico'
      }
    ]
  })
</script>
<script>
  export default {
    name: 'addBot',
    data() {
      const config = useRuntimeConfig()
      return {
        host: config.public.domain,
        botid: "961433265879801936"
      };
    },
    methods: {
      async submitBot() {
        const refsKeys = Object.keys(this.$refs)
        const requiredKeys = refsKeys.filter(ref=>this.$refs[ref].required)

        requiredKeys.forEach(ref=>{
          if (this.$refs[ref].value==="") {
            this.$refs[ref].classList.add("red")
            this.$refs[ref].classList.add("accent-1")
          } else {
            this.$refs[ref].classList.remove("red")
            this.$refs[ref].classList.remove("accent-1")
          }
        })

        const hasErrors = requiredKeys.every(ref=>this.$refs[ref].value==="")
        if (hasErrors) return; 

        const values = Object.assign({}, ...(refsKeys.map(ref => { return { [ref]: this.$refs[ref].type === "checkbox" ? this.$refs[ref].checked : this.$refs[ref].value } })));

        const { error } = await useFetch(() => `/api/bots/add`, {
          method: 'post',
          body: values
        })
        if (error.value) this.$M.toast({text: "error adding bot"})
        else await navigateTo(`/bots/${this.$refs.botid.value}`);
      },
      botIdUpdated(){
        if (this.$refs.botid.value==="") return this.botid = "685166801394335819"
        this.botid = this.$refs.botid.value
      }
    }
  }
</script>