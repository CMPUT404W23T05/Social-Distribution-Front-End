import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes.js'
import { useTokenStore } from '@/stores/token.js'
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})
router.beforeEach((to, from) => {
  const token = useTokenStore()
  // if the user is not logged in and tries to access a page other than login or signup, redirect to login
  const exceptions = ['login', 'signup']
  if (!token.isAuthenticated && !exceptions.includes(to.name)) {
    return '/login'
  }
})
export default router
