// Components to render the views go here
import ManagePost from '@/views/ManagePostsView.vue'
import BrowsePage from '../views/BrowseView.vue'
import LogIn from '../views/LoginView.vue'
import SignUp from '../views/SignUpView.vue'
import SocialView from '../views/SocialView.vue'
import SettingsView from '../views/SettingsView.vue'
import InboxView from '../views/InboxView.vue'
import SinglePostView from '../views/SinglePostView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// Routes go here
export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'homepage',
    component: InboxView
  },
  {
    path: '/browse',
    name: 'browsepage',
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
  },
  {
    // authorID; postID
    path: '/authors/:aid/posts/:pid',
    name: 'postpage',
    component: SinglePostView
  }, {
    path: '/:pathMatch(.*)*',
    beforeEnter: () => {
      window.location.assign('/404') // redirect to 404 page to trigger Django to send 404 response
    },
    name: 'NotFound',
    component: NotFoundView
  },
  {
    path: '/404',
    name: '404',
    component: NotFoundView
  }
]
