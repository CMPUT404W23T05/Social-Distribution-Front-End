import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

createApp(App).use(router).use(createPinia()).mount('#app')
