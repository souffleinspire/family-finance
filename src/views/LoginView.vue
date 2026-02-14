<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo/标题 -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6">
          <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-semibold text-text-primary mb-2">家庭账本</h1>
        <p class="text-text-tertiary">简单记账，安心生活</p>
      </div>
      
      <!-- 登录表单 -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
            />
          </div>
          
          <div v-if="error" class="p-4 rounded-xl bg-accent/10 text-accent text-sm">
            {{ error }}
          </div>
          
          <button 
            type="submit" 
            class="btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <router-link 
            to="/register" 
            class="text-primary hover:text-primary-dark text-sm transition-colors"
          >
            还没有账号？去注册
          </router-link>
        </div>
      </div>
      
      <!-- 演示提示 -->
      <div class="mt-8 p-4 rounded-xl bg-bg-secondary text-center">
        <p class="text-text-tertiary text-sm">
          💡 演示账号：任意用户名 + 任意密码（首次注册即为新账号）
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useExpenseStore } from '@/stores/expenses'
import { useIncomeStore } from '@/stores/incomes'
import { useAssetStore } from '@/stores/assets'
import { useGoalStore } from '@/stores/goals'

const router = useRouter()
const authStore = useAuthStore()
const expenseStore = useExpenseStore()
const incomeStore = useIncomeStore()
const assetStore = useAssetStore()
const goalStore = useGoalStore()

const form = reactive({
  name: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form.name, form.password)
    
    // 初始化各 store
    await Promise.all([
      expenseStore.init(),
      incomeStore.init(),
      assetStore.init(),
      goalStore.init()
    ])
    
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
