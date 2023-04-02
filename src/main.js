import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import axiosUtil from './util/axiosUtil.js'

const app = createApp(App)
app.use(axiosUtil)
app.use(router, axios).use(createPinia()).mount('#app')

app.config.globalProperties.$http = axios
