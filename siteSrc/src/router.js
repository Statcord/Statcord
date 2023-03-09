import { createRouter, createWebHistory } from 'vue-router'

import home from './pages/home.vue'
import support from './pages/support.vue'
import privacy from './pages/privacy.vue'
import login from './pages/authentication/login.vue'
import logout from './pages/authentication/logout.vue'
import me from './pages/me.vue'

const routes = [
    { path: '/',component: home},
    { path: '/support', component: support},
    { path: '/privacy', component: privacy},
    { path: '/login', component: login},
    { path: '/logout', component: logout},
    { path: '/me', component: me},
    { path: "/:pathMatch(.*)", component: home},
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;