<template>  
    <div class="container">
        <h4>Add your bot</h4>

        <div class="section">
            <div class="row">
                <div class="col s12 m6">
                    <label for="botid">Enter the Bot ID</label>
                    <input type="text" ref="botid" pattern="[0-9]{17,21}" placeholder="685166801394335819">
                </div>
    
                <div class="col s12 m6">
                    <label for="AdditionalBotOwnerIDs">Additional Bot Owner IDs</label>
                    <input type="text" ref="AdditionalBotOwnerIDs" class="disabled" disabled pattern="[0-9]{17,21}" placeholder="685166801394335819">
                </div>
            </div>
        </div>
        
        <div class="divider"></div>


        <div class="section">
            <div class="row">
                <div class="col s12 m6">
                    <label for="Prefix">Prefix</label>
                    <input type="text" ref="Prefix" pattern="[0-9]{17,21}" disabled placeholder="/">
                </div>
    
                <div class="col s12 m6">
                    <label for="AdditionalBotOwnerIDs">Invite</label>
                    <input type="text" ref="AdditionalBotOwnerIDs" class="disabled" pattern="[0-9]{17,21}" placeholder="">
                </div>
            </div>
        </div>

        <div class="section">
            <div class="row">
                <div class="col s12 m12">
                    <label for="Prefix">short desc</label>
                    <input type="text" ref="Prefix" pattern="[0-9]{17,21}" placeholder="/">
                </div>
    
                <div class="col s12 m12">
                    <label for="AdditionalBotOwnerIDs">long desc</label>
                    <input type="text" ref="AdditionalBotOwnerIDs" class="disabled" pattern="[0-9]{17,21}" placeholder="">
                </div>
            </div>
        </div>





      <div class="modal-footer">
        <div>
          <div class="modal-close waves-effect waves-light btn left">Cancel</div>
          <div class="modal-close waves-effect waves-light btn right" @click="submitBot">Add bot</div>
        </div>
      </div>
    </div>
</template>

  <script setup>
  useSeoMeta({
    title: 'DisStat - My bots',
    description: "Track your Discord bot's statistics using DisStat.",
    ogTitle: 'DisStat - My bots',
    ogDescription: "Track your Discord bot's statistics using DisStat.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://disstat.numselli.xyz',
    twitterTitle: 'DisStat - My bots',
    twitterDescription: "Track your Discord bot's statistics using DisStat.",
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
    name: 'me',
    data() {
      return {
        isProfileOwner: false,
        profileInfo: {}
      };
    },
    methods: {
      async submitBot() {
        const {error} = await useFetch(() => `/api/bots/add`, {
          method: 'post',
          body: JSON.stringify({id:this.$refs.botid.value}),
          headers: {'Content-Type': 'application/json'}
        })
        if (!error.value) await navigateTo(`/bots/${this.$refs.botid.value}`);
        else this.$M.toast({text: "error adding bot"})
      }
    },
    async mounted() {
    //   this.isProfileOwner = this.$auth.getUser()?.id === this.$route.params.userID
  
    //   const {data: user} = await useFetch(`/api/user/${this.$route.params.userID}`)
    //   // if (!user.value.public) await navigateTo("/login");
    //   this.profileInfo = user.value
      
    //   this.$M.Modal.init(this.$refs.modal, {
    //     onOpenStart: ()=> this.$refs.modal.classList.remove("hide")
    //   })
    }
  }
  </script>