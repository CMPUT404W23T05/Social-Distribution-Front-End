// Components to render the views go here
import ManagePost from '@/views/ManagePostsView.vue'
import Home from '../views/Home.vue'
import BrowsePage from '../views/Browse.vue'
import LogIn from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import SocialView from '../views/SocialView.vue'
import SettingsView from '../views/SettingsView.vue'

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
  },
  {
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
    path: '/home/manage-posts',
    name: 'manageposts',
    component: ManagePost
  },
  {
    path: '/social',
    name: 'SocialPage',
    component: SocialView
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsView
  }
]
