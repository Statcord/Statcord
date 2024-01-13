<template>
   <div>
        <h5>shortDesc</h5>
        <h6 class="flow-text">{{ botJson.shortdesc }}</h6>
   </div>


   <div>
        <h5>longdesc</h5>
        <div v-if="longdescRendered !== ''" v-html="longdescRendered" class="flow-text" ></div>
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
    props: {
        botJson: Object
    },
    data() {
        return {
            botid: "",
            longdescRendered: ""
        }
    },
    async mounted() {
        this.botid = this.$route.params.id
        
        if (this.$props.botJson.longdesc) this.longdescRendered = this.$md.render(this.$props.botJson.longdesc)
    },
}
</script>