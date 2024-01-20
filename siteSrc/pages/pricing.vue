<template>
    <div class="container">
        <div class="row" style="gap:10px;">
            <div class="col s12 m6">
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

            <div class="col s12 m6">
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
                                <li>Everything in Free teir</li>
                                <li>More custom charts</li>
                                <li>Toggle defualt chart visibility</li>
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
    </div>
  </template>
  
  <script setup>
  useSeoMeta({
    title: 'DisStat - Pricing',
    // description: "Read DisStat's bot statistics tracking setup guide.",
    ogTitle: 'DisStat - Pricing',
    // ogDescription: "Read DisStat's bot statistics tracking setup guide.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://disstat.numselli.xyz',
    twitterTitle: 'DisStat - Pricing',
    // twitterDescription: "Read DisStat's bot statistics tracking setup guide.",
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
    name: 'pricing'
  }
  </script>
  