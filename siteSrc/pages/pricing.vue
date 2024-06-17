<template>
    <UContainer>
        <div class="grid md:grid-cols-2 sm:grid-cols-1 justify-evenly">
            <div class="max-w-sm overflow-hidden shadow-md rounded-xl">
                <nuxt-img class="w-full" alt="" src="/img/icon.png" />
                <div class="px-4 py-4">
                    <UContainer>
                        <span class="font-semibold">Basic</span>
                        <div class="text-center">
                            <div>
                                <sub class="align-top">USD</sub>
                                <span class="font-bold">$0.00</span>
                            </div>
                            <div>
                                <span>PER MONTH</span>
                            </div>
                        </div>

                        <div>
                            <ul class="list-disc">
                                <li>Basic stats tracking</li>
                                <li>2 Custom charts</li>
                            </ul>
                        </div>
                    </UContainer>
                </div>
            </div>

            <div class="max-w-sm overflow-hidden shadow-md rounded-xl">
                <nuxt-img class="w-full" alt="" src="/img/icon.png" />
                <div class="px-4 py-4">
                    <UContainer>
                        <span class="font-semibold">Advanced</span>
                        <div class="text-center	">
                            <div>
                                <sub class="align-top">USD</sub>
                                <span class="font-bold place-content-center">$?.??</span>
                            </div>
                            <div>
                                <span>PER MONTH</span>
                            </div>
                        </div>


                        <div>
                            <ul class="list-disc">
                                <li>Basic stats tracking</li>
                                <li>More custom charts</li>
                                <li>Toggle chart visibility</li>
                                <li>Toggle card visibility<sub class="align-top">1</sub></li>
                                <li>Custom bot url<sub class="align-top">2</sub></li>
                            </ul>
                        </div>
                    </UContainer>
                </div>
                <div class="bg-blue-400 text-center text-xl cursor-pointer">
                    <span class="pt-6">Join</span>
                    <!-- <form action="/api/stripe/session/checkout" method="POST"> -->
                        <!-- <input type="hidden" name="lookup_key" value="plus">
                        <input type="hidden" name="test" value="testdata"> -->
                        <!-- <button id="checkout-and-portal-button" type="submit" class="">Checkout</button> -->
                    <!-- </form> -->
                    <!-- <div class=""> -->
                        <!-- <h6>Join</h6> -->
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </UContainer>
  </template>
  
<script setup>
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
<script>
  export default {
    name: 'pricing'
  }
</script>
  