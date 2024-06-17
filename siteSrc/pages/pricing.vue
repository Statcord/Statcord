<template>
    <UContainer>
        <div class="row" style="gap:10px;">
            <div class="col s12 m3 offset-m3">
                <div class="card">
                    <div class="card-image">
                        <img src="/img/icon.png" class="responsive-img">
                        <span class="card-title black-text">Basic</span>
                    </div>
                    <div class="card-content">
                        <div class="center-align">
                            <div>
                                <sub style="vertical-align:top;">USD</sub>
                                <span style="font-weight:bold;">$0.00</span>
                            </div>
                            <div>
                                <span>PER MONTH</span>
                            </div>
                        </div>
                        <div>
                            <ul class="browser-default">
                                <li>Basic stats tracking</li>
                                <li>2 Custom charts</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-action">
                        <form action="/api/stripe/session/checkout" method="POST">
                            <input type="hidden" name="lookup_key" value="plus">
                            <input type="hidden" name="test" value="testdata">
                            <button id="checkout-and-portal-button" type="submit" class="hide">Checkout</button>
                        </form>
                        <div class="waves-effect waves-light btn disabled" style="width: 100%;">
                            <h6>Join</h6>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col s12 m3">
                <div class="card">
                    <div class="card-image">
                        <img src="/img/icon.png" class="responsive-img">
                        <span class="card-title black-text">Advanced</span>
                    </div>
                    <div class="card-content">
                        <div class="center-align">
                            <div>
                                <sub style="vertical-align:top;">USD</sub>
                                <span style="font-weight:bold;">$ ??</span>
                            </div>
                            <div>
                                <span>PER MONTH</span>
                            </div>
                        </div>
                        <div>
                            <ul class="browser-default">
                                <li>Basic stats tracking</li>
                                <li>More custom charts</li>
                                <li>Toggle chart visibility</li>
                                <li>Toggle card visibility<sub style="vertical-align:top;">1</sub></li>
                                <li>Custom bot url<sub style="vertical-align:top;">2</sub></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-action">
                        <form action="/api/stripe/session/checkout" method="POST">
                            <input type="hidden" name="lookup_key" value="plus">
                            <input type="hidden" name="test" value="testdata">
                            <button id="checkout-and-portal-button" type="submit" class="hide">Checkout</button>
                        </form>
                        <div class="waves-effect waves-light btn disabled" style="width: 100%;">
                            <h6>Join</h6>
                        </div>
                    </div>
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
  