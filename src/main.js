import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'

// http://localhost:8000/api
axios.defaults.baseURL = 'http://localhost:3000' // API URL

createApp(App).use(router, axios).mount('#app')
