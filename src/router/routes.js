// Components to render the views go here
import Home from '../views/Home.vue'
import BrowsePage from '../views/Browse.vue'

// Routes go here
export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'homepage',
    component: Home
  },
  {
    path: '/browse',
    name: 'browse',
    component: BrowsePage
  }
]
