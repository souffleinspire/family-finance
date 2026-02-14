<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <p class="text-text-tertiary">加载中...</p>
  </div>
  <div v-else class="min-h-screen pb-24">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <div>
          <h1 class="text-xl font-semibold text-text-primary">家庭账本</h1>
          <p class="text-sm text-text-tertiary">{{ formattedDate }}</p>
        </div>
        <router-link to="/settings" class="p-2 rounded-full bg-bg-secondary">
          <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </router-link>
      </div>
    </header>
    
    <main class="px-6 py-6 space-y-6">
      <!-- 最近记录 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-text-primary">最近记录</h2>
          <router-link to="/expenses" class="text-sm text-primary hover:text-primary-dark">
            查看全部 →
          </router-link>
        </div>
        
        <div v-if="recentExpenses.length === 0" class="text-center py-8">
          <p class="text-text-tertiary">还没有记录，去记一笔吧</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="expense in recentExpenses" 
            :key="expense.id"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-bg-secondary transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <span class="text-accent text-sm">支</span>
              </div>
              <div>
                <p class="font-medium text-text-primary">{{ expense.type }}</p>
                <p class="text-xs text-text-tertiary">{{ expense.date }} · {{ expense.userName }}</p>
              </div>
            </div>
            <span class="font-medium text-accent">-¥{{ formatMoney(expense.amount) }}</span>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light safe-bottom">
      <div class="flex justify-around py-2">
        <router-link to="/" class="flex flex-col items-center p-2 text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1">资产负债</span>
        </router-link>
        
        <router-link to="/expenses" class="flex flex-col items-center p-2 text-text-tertiary hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text-xs mt-1">收入支出</span>
        </router-link>
        
        <router-link to="/goals" class="flex flex-col items-center p-2 text-text-tertiary hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-xs mt-1">财务目标</span>
        </router-link>
        
        <router-link to="/sync" class="flex flex-col items-center p-2 text-text-tertiary hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span class="text-xs mt-1">保险</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useAuthStore } from '@/stores/auth'
import { useExpenseStore } from '@/stores/expenses'

const authStore = useAuthStore()
const expenseStore = useExpenseStore()

const loading = ref(true)

const formattedDate = computed(() => {
  return format(new Date(), 'yyyy年M月d日 EEEE', { locale: zhCN })
})

const recentExpenses = computed(() => {
  return expenseStore.expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

onMounted(async () => {
  try {
    await Promise.all([
      authStore.init(),
      expenseStore.init()
    ])
  } finally {
    loading.value = false
  }
})
</script>
