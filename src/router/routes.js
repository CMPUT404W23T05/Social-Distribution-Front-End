// Components to render the views go here
import ManagePost from '@/views/ManagePostsView.vue'
import Home from '../views/Home.vue'

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
    path: '/home/manage-posts',
    name: 'manageposts',
    component: ManagePost
  }
]
