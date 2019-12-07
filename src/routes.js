import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from './components/views/Home.vue'

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'home', component: Home },
    //{ path: '/home', name: 'home', component: Home },
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;
