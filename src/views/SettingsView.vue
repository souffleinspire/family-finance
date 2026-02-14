<template>
  <div class="min-h-screen pb-24">
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <router-link to="/" class="p-2 -ml-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold text-text-primary">设置</h1>
        <div class="w-10"></div>
      </div>
    </header>
    
    <main class="px-6 py-6 space-y-6">
      <!-- 当前用户 -->
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <span class="text-2xl text-primary">{{ authStore.currentUser?.name?.charAt(0) }}</span>
          </div>
          <div>
            <p class="font-semibold text-text-primary">{{ authStore.currentUser?.name }}</p>
            <p class="text-sm text-text-tertiary">家庭成员</p>
          </div>
        </div>
      </div>
      
      <!-- 家庭成员管理 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">家庭成员</h2>
        <p class="text-sm text-text-tertiary mb-4">添加家庭成员账号，方便多人记账</p>
        
        <div class="space-y-3 mb-4">
          <div 
            v-for="user in allUsers" 
            :key="user.id"
            class="flex items-center justify-between p-3 rounded-xl bg-bg-secondary"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span class="text-primary text-sm">{{ user.name.charAt(0) }}</span>
              </div>
              <span class="text-text-primary">{{ user.name }}</span>
            </div>
            <span v-if="user.id === authStore.currentUser?.id" class="text-xs text-text-tertiary">自己</span>
          </div>
        </div>
        
        <button @click="showAddMember = true" class="btn-secondary w-full">
          + 添加家庭成员
        </button>
      </div>
      
      <!-- 数据管理 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">数据管理</h2>
        
        <div class="space-y-3">
          <button @click="$router.push('/sync')" class="w-full p-4 rounded-xl bg-bg-secondary flex items-center justify-between hover:bg-border-light transition-colors">
            <span class="text-text-primary">同步中心</span>
            <svg class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button @click="handleLogout" class="w-full p-4 rounded-xl bg-accent/10 text-accent flex items-center justify-between">
            <span>退出登录</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 关于 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">关于</h2>
        <p class="text-sm text-text-tertiary">
          家庭账本 v1.0.0<br>
          简单记账，安心生活
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const allUsers = computed(() => authStore.users)
const showAddMember = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => { await authStore.init() })
</script>
