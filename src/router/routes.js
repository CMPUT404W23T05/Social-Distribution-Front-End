// Components to render the views go here
import Home from '../views/Home.vue'
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
