<template>
   <div>
        <h5>shortDesc</h5>
        <h6>{{ botJson.shortdesc }}</h6>
   </div>


   <div>
        <h5>longdesc</h5>
        <div v-if="longdescRendered !== ''" v-html="longdescRendered"></div>
        <!-- <h6>{{ botJson.longdesc }}</h6> -->
   </div>

   <div>
        <h5>links</h5>
        <openLink icon="add" name="Invite" :url="botJson.invite" ></openLink>
   </div>
</template>

<script>
import openLink from './openLink.vue'

export default {
    name: 'bot',
    components: {
        openLink
    },
    data() {
        return {
            botid: "",
            botJson:{},
            longdescRendered: ""
        }
    },
    async mounted() {
        this.botid = this.$route.params.id

        const {data: botJson} = await useFetch(`/api/bots/${this.botid}`)
        this.botJson=botJson.value
        
        if (botJson.value.longdesc) this.longdescRendered = this.$md.render(botJson.value.longdesc)
    },
}
</script>