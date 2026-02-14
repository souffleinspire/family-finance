import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from '@/stores/auth'
import './assets/styles/main.css'

async function startApp() {
  const app = createApp(App)
  const pinia = createPinia()
  
  app.use(pinia)
  app.use(router)
  
  // 现在 Pinia 已连接，可以安全初始化 stores
  const authStore = useAuthStore()
  await authStore.init()
  
  app.mount('#app')
}

startApp()
