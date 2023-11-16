import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChatView from '../views/ChatView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/NDAdrop/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/NDAdrop/chat',
      name: 'chat',
      component: ChatView,
    },
    {
      path: '/NDAdrop/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
