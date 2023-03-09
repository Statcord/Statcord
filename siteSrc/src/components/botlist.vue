<template>
    <div class="row">
        <router-link class="col s12 m2" :to="'/bots/' + bot.botid" v-for="bot in bots">
            <div class="card">
                <div class="card-image">
                    <img :src="'https://cdn.discordapp.com/avatars/' + bot.botid + '/' + bot.avatar + '.png'" alt="">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <p>{{ bot.username }}</p>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'botlist',
    props: {
        bots: Array,
    }
};
</script>