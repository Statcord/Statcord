<template>
    <UContainer>
        <UPricingPlans>
            <UPricingPlan v-for="(plan, index) in plans" :key="index" v-bind="plan" />
        </UPricingPlans>
    </UContainer>
  </template>
  
<script setup>
    const plans = ref([
        {
            title: 'Basic',
            // description: '',
            price: '$0.00',
            features: [
                'Basic stats tracking',
                '2 Custom charts'
            ],
            button: {
                label: 'Included',
                disabled: true,
            }
        },
        {
            title: 'Advanced',
            // description: '',
            price: '$?.??',
            features: [
                'Basic stats tracking',
                'More custom charts',
                'Toggle chart visibility',
                'Toggle card visibility',
                'Custom bot url',
            ],
            button: {
                label: 'Subscribe now',
                disabled: true,
                onClick(){
                }
            }
        }
    ])

    useSeoMeta({
        themeColor: "#0080F0",
        description: "Checkout Statcord premium offerings.",
        ogDescription: "Checkout Statcord premium offerings.",
        ogImage: '/img/icon.png',
        ogUrl: 'https://statcord.com',
        twitterDescription: "Checkout Statcord premium offerings.",
        twitterImage: '/img/icon.png',
        twitterCard: 'summary'
    })
</script>