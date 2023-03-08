import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes.js'
import { useTokenStore } from '@/stores/token.js'
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
  }
})
router.beforeEach((to, from) => {
  const token = useTokenStore()
  token.initializeStore() // check if token is in local storage
  // if the user is not logged in and tries to access a page other than login or signup, redirect to login
  const exceptions = ['login', 'signup']
  if (!token.isAuthenticated && !exceptions.includes(to.name)) {
    return '/login'
  } else if (token.isAuthenticated && exceptions.includes(to.name)) {
    return '/home#loggedin' // if the user is logged in and tries to access login or signup, redirect to home
  }
})
export default router
