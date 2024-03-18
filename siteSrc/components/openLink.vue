<template>
    <div v-if="url">
        <span class="flow-text modal-trigger blue-text text-darken-2 myLink" :data-target="uuid"><i class="material-icons">{{icon}}</i> {{name}}</span>
        <div :id="uuid" :ref="uuid" class="modal hide">
            <div class="modal-content">
                <h4>Leaving Statcord</h4>
                <h6 class="flow-text">This link will take you to the following website</h6>
                
                <div>
                    <p class="flow-text" style="word-break: break-all">https://<b>{{ displayURL[0] }}</b>{{ displayURL.join("/").replace(displayURL[0], "") }}</p>
                </div>
            </div>
            <div class="modal-footer">
                <div>
                    <div class="modal-close waves-effect waves-light btn left">Go back</div>
                    <div class="waves-effect waves-light btn" @click="visit">Visit Site</div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'openlink',
    data() {
        const displayURL= this.$props.url?.replace("https://","").split("/")
        return {
            displayURL,
            uuid: (Math.floor(Math.random() * 560987)*150).toString(36)
        }
    },
    props: {
        icon: String,
        name: String,
        url: String
    },
    async mounted() {
        this.$M.Modal.init(this.$refs[this.uuid], {
            onOpenStart: ()=> this.$refs[this.uuid].classList.remove("hide")
        })
    },
    methods: {
        async visit() {
            navigateTo(this.url, {
                external: true,
                open: {
                    target: "_blank",
                },
            });
        }
    }
}
</script>

<style>
.myLink:hover{
    cursor:pointer;
}
</style>