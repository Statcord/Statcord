<template>
    <UButton label="Delete chart" color="red" icon="i-heroicons-trash" @click="isOpen = true" />

    <UModal v-model="isOpen">
        <div class="p-4 bg-gray-800 text-gray-300 font-medium">
            <div class="modal-content">
                <h4>Confirm deletion of {{ chartName }}</h4>
            </div>

            <div>
                <div class="grid grid-cols-6 gap-4">
                    <div class="col-start-1 col-end-3">
                        <UButton label="Cancel" @click="isOpen = false" />
                    </div>
                    <div class="col-end-7 col-span-2">
                        <UButton label="Delete forever (really!)" color="red" icon="i-heroicons-trash" @click="confirmedCustomDelete" />
                    </div>
                </div>
            </div>
        </div>
    </UModal>
</template>

<script setup>
const isOpen = ref(false)
</script>

<script>

export default {
    name: 'deleteCustomChart',
    data() {
        return {
        }
    },
    methods: {
        async confirmedCustomDelete() {
            this.$toast.add({title: 'Deleting'})
            const {error} = await useFetch(() => `/api/bots/${this.$route.params.id}/settings/deleteCustomChart`, {
                method: 'delete',
                body: {
                    chartid: this.$props.chartid
                }
            });
            this.$toast.add({title: error.value? 'Error deleting' : 'Deleted'})
        }
    },
    props: {
        chartid: String,
        chartName: String
    }
};
</script>