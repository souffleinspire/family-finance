import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from '@/stores/auth'
import './assets/styles/main.css'

// 初始化认证状态（确保路由守卫能正确获取用户数据）
const authStore = useAuthStore()
authStore.init()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
