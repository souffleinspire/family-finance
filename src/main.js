import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from '@/stores/auth'
import './assets/styles/main.css'

// 确保认证初始化完成后再启动应用
async function startApp() {
  const authStore = useAuthStore()
  await authStore.init()
  
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

startApp()
