<template>
    <UContainer>
        <h6 class="flow-text">{{ botJson.shortdesc }}</h6>
        <UDivider />

        <div>
            <div v-if="longdescRendered !== ''" v-html="longdescRendered" class="flow-text"></div>
        </div>
        
        <UDivider />
        <div>
            <h5>links</h5>
            <openLink icon="add" name="Invite" :url="botJson.invite"></openLink>
            <openLink v-for="link in botJson.links" :icon="link.icon" :name="link.name" :url="link.url"></openLink>
        </div>
    </UContainer>
</template>

<script>
import openLink from './openLink.vue'

export default {
    name: 'botLongListing',
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