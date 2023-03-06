// Components to render the views go here
import Home from '../views/Home.vue'
import SocialView from '../views/SocialView.vue'
import LogIn from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'

// Routes go here
export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'homepage',
    component: Home
  }
]
