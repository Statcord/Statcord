<template>
    <a target="_blank" rel="noopener noreferrer" data-target="linkModal1" class="modal-trigger"><i class="material-icons">{{icon}}</i>{{name}}</a>

    <div id="linkModal1" ref="linkModal1" class="modal hide">
        <div class="modal-content">
            <h4>Leaving DisStat</h4>
            <span>This link will take you to the following website</span>
            <br>
            <span>{{ url }}</span>
        </div>
        <div class="modal-footer">
            <div>
                <div class="modal-close waves-effect waves-light btn left">Go back</div>
                <div class="waves-effect waves-light btn" @click="visit">Visit Site</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'openlink',
    data() {
        return {
        }
    },
    props: {
        icon: String,
        name: String,
        url: String
    },
    async mounted() {
        this.$M.Modal.init(this.$refs.linkModal1, {
            onOpenStart: ()=> this.$refs.linkModal1.classList.remove("hide")
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
