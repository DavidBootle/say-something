import { createRouter, createWebHistory } from "vue-router";
import Home from './Home.vue'
import Poll from './Poll.vue'
import Error404 from './Error404.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/:id", component: Poll },
    { // redirect old poll url to new poll url
      path: '/poll/:id',
      redirect: to => {
        return { path: `/${to.params.id}`}
      }
    },
    { path: '/:pageParams(.*)*', name: 'NotFound', component: Error404 },
  ]
});
