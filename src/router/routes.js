// Components to render the views go here
import Home from '../views/Home.vue'
<<<<<<< HEAD
import BrowsePage from '../views/Browse.vue'

=======
import LogIn from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import SocialView from '../views/SocialView.vue'
>>>>>>> b8c93ff8a85c754014fc04c829556414883b49ca
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
<<<<<<< HEAD
    path: '/browse',
    name: 'browse',
    component: BrowsePage
=======
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
    path: '/social',
    name: 'SocialPage',
    component: SocialView
>>>>>>> b8c93ff8a85c754014fc04c829556414883b49ca
  }
]
