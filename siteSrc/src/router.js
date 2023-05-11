import { createRouter, createWebHistory } from 'vue-router'

import home from './pages/home.vue'
import support from './pages/support.vue'
import privacy from './pages/privacy.vue'
import login from './pages/authentication/login.vue'
import logout from './pages/authentication/logout.vue'
import me from './pages/user/me.vue'
import userSettings from './pages/user/settings.vue'
import botPage from './pages/bots/bot.vue'
import manageBot from './pages/bots/manageBot.vue'

import error404 from './pages/errors/404.vue'

const routes = [
    { path: '/',component: home},
    { path: '/support', component: support},
    { path: '/privacy', component: privacy},
    { path: '/login', component: login},
    { path: '/logout', component: logout},
    { path: '/me', component: me},
    { path: '/me/settings', component: userSettings},
    { path: '/bots/:botid', component: botPage},
    { path: '/bots/:botid/manage', component: manageBot},
    { path: "/:pathMatch(.*)", component: error404},
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;