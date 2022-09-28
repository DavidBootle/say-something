import { createRouter, createWebHistory } from "vue-router";
import Home from './Home.vue'
import Poll from './Poll.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/poll/:id", component: Poll }
]
});
