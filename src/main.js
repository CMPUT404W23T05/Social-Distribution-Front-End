import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8001/api' // API URL

const app = createApp(App)
app.use(router, axios).use(createPinia()).mount('#app')
app.config.globalProperties.$http = axios
