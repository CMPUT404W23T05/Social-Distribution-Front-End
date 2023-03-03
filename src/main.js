import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api' // API URL

createApp(App).use(router, axios).use(createPinia()).mount('#app')
