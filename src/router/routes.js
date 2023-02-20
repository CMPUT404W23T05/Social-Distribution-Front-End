// Components to render the views go here
import Home from '../views/Home.vue'
import LogIn from '../views/Login.vue'

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
    path: '/login',
    name: 'login',
    component: LogIn
  }
]
