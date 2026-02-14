<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-semibold text-text-primary mb-2">注册账号</h1>
        <p class="text-text-tertiary">创建你的家庭账本账号</p>
      </div>
      
      <!-- 注册表单 -->
      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">用户名</label>
            <input 
              v-model="form.name"
              type="text" 
              class="input"
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">密码</label>
            <input 
              v-model="form.password"
              type="password" 
              class="input"
              placeholder="请输入密码"
              required
              minlength="6"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">确认密码</label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              class="input"
              placeholder="请再次输入密码"
              required
            />
          </div>
          
          <div v-if="error" class="p-4 rounded-xl bg-accent/10 text-accent text-sm">
            {{ error }}
          </div>
          
          <div v-if="success" class="p-4 rounded-xl bg-primary/10 text-primary text-sm">
            注册成功！正在跳转...
          </div>
          
          <button 
            type="submit" 
            class="btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="loading">注册中...</span>
            <span v-else>注册</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <router-link 
            to="/login" 
            class="text-primary hover:text-primary-dark text-sm transition-colors"
          >
            已有账号？去登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  if (form.password !== form.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  if (form.password.length < 6) {
    error.value = '密码长度至少为6位'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(form.name, form.password)
    success.value = true
    
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
