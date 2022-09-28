import { createRouter, createWebHistory } from "vue-router";
import Home from './Home.vue'
import Poll from './Poll.vue'
import Error404 from './Error404.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/poll/:id", component: Poll },
    { path: '/:pageParams(.*)*', name: 'NotFound', component: Error404 },
  ]
});
