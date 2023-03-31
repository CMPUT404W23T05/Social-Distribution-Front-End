import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import axiosUtil from './plugins/axiosUtil.js'

axios.defaults.baseURL = 'https://social-t30.herokuapp.com/api' // API URL

const app = createApp(App)
app.use(axiosUtil)
app.use(router, axios).use(createPinia()).mount('#app')

app.config.globalProperties.$http = axios
