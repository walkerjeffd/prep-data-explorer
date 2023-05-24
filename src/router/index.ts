import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserGuideView from '../views/UserGuideView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user-guide',
      name: 'user-guide',
      component: UserGuideView
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: () => import('../views/ExplorerView.vue')
    }
  ]
})

export default router
