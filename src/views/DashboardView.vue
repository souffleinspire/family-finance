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
      <!-- 家庭总资产 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">家庭总资产</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 rounded-xl bg-bg-secondary">
            <p class="text-sm text-text-tertiary mb-1">总资产</p>
            <p class="text-xl font-semibold text-primary">¥{{ formatMoney(totalAssets) }}</p>
          </div>
          <div class="text-center p-4 rounded-xl bg-bg-secondary">
            <p class="text-sm text-text-tertiary mb-1">净资产</p>
            <p class="text-xl font-semibold" :class="netAssets >= 0 ? 'text-primary' : 'text-accent'">
              ¥{{ formatMoney(netAssets) }}
            </p>
          </div>
          <div class="text-center p-4 rounded-xl bg-bg-secondary">
            <p class="text-sm text-text-tertiary mb-1">总负债</p>
            <p class="text-xl font-semibold text-accent">¥{{ formatMoney(totalLiabilities) }}</p>
          </div>
        </div>
      </div>
      
      <!-- 最近记录 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-text-primary">最近记录</h2>
        </div>
        
        <div v-if="recentRecords.length === 0" class="text-center py-8">
          <p class="text-text-tertiary">还没有记录</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="record in recentRecords" 
            :key="record.id"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-bg-secondary transition-colors"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="record.category === '负债' ? 'bg-accent/20' : 'bg-primary/20'"
              >
                <span 
                  class="text-sm"
                  :class="record.category === '负债' ? 'text-accent' : 'text-primary'"
                >
                  {{ record.category === '负债' ? '负' : (record.type === 'income' ? '收' : '支') }}
                </span>
              </div>
              <div>
                <p class="font-medium text-text-primary">{{ record.name || record.type || record.source }}</p>
                <p class="text-xs text-text-tertiary">{{ record.date }} · {{ record.userName }}</p>
              </div>
            </div>
            <span 
              class="font-medium"
              :class="record.category === '负债' ? 'text-accent' : (record.type === 'income' ? 'text-primary' : 'text-accent')"
            >
              {{ record.type === 'income' ? '+' : '-' }}¥{{ formatMoney(record.amount) }}
            </span>
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
    
    <!-- 浮动添加按钮 -->
    <button 
      @click="showAddAssetModal = true"
      class="fixed bottom-20 right-6 w-14 h-14 rounded-full gradient-accent flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
    >
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
    
    <!-- 添加资产弹窗 -->
    <div v-if="showAddAssetModal" class="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-t-3xl shadow-soft-lg p-6 animate-slide-up">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-text-primary">添加资产</h2>
          <button @click="showAddAssetModal = false" class="p-2 rounded-full hover:bg-bg-secondary">
            <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleAddAsset" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">名称</label>
            <input v-model="assetForm.name" type="text" class="input" placeholder="如：工资卡、房贷" required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">类别</label>
            <div class="grid grid-cols-4 gap-2">
              <button 
                v-for="cat in assetCategories" 
                :key="cat"
                type="button"
                @click="assetForm.category = cat"
                class="py-3 rounded-xl text-sm font-medium transition-colors"
                :class="assetForm.category === cat ? 'bg-primary text-white' : 'bg-bg-secondary text-text-secondary'"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
            <input v-model.number="assetForm.amount" type="number" class="input" placeholder="0" required />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddAssetModal = false" class="btn-secondary flex-1">取消</button>
            <button type="submit" class="btn-primary flex-1">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useAuthStore } from '@/stores/auth'
import { useExpenseStore } from '@/stores/expenses'
import { useIncomeStore } from '@/stores/incomes'
import { useAssetStore } from '@/stores/assets'

const authStore = useAuthStore()
const expenseStore = useExpenseStore()
const incomeStore = useIncomeStore()
const assetStore = useAssetStore()

const loading = ref(true)
const showAddAssetModal = ref(false)
const assetCategories = ['流动资金', '固定资产', '投资理财', '负债']
const assetForm = reactive({
  name: '',
  category: '流动资金',
  amount: ''
})

const formattedDate = computed(() => {
  return format(new Date(), 'yyyy年M月d日 EEEE', { locale: zhCN })
})

// 资产计算
const totalAssets = computed(() => {
  return assetStore.assets
    .filter(a => a.category !== '负债')
    .reduce((sum, a) => sum + (a.amount || 0), 0)
})

const totalLiabilities = computed(() => {
  return assetStore.assets
    .filter(a => a.category === '负债')
    .reduce((sum, a) => sum + (a.amount || 0), 0)
})

const netAssets = computed(() => totalAssets.value - totalLiabilities.value)

// 最近记录（合并收支和资产）
const recentRecords = computed(() => {
  const currentMonth = format(new Date(), 'yyyy-MM')
  
  // 只显示当月的收支记录
  const expenses = expenseStore.expenses
    .filter(e => e.date && e.date.startsWith(currentMonth))
    .map(e => ({
    ...e,
    type: 'expense',
    category: '支出',
    name: e.type,
    displayDate: e.date
  }))
  
  const incomes = incomeStore.incomes
    .filter(i => i.date && i.date.startsWith(currentMonth))
    .map(i => ({
    ...i,
    type: 'income',
    category: '收入',
    name: i.source,
    displayDate: i.date
  }))
  
  // 资产没有日期，显示创建时间
  const assets = assetStore.assets.map(a => ({
    ...a,
    type: 'asset',
    category: a.category,
    name: a.name,
    displayDate: a.createdAt ? a.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
  }))
  
  console.log('Recent records:', { expenses, incomes, assets })
  
  return [...expenses, ...incomes, ...assets]
    .sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate))
    .slice(0, 10)
})

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

async function handleAddAsset() {
  if (!authStore.currentUser || !assetForm.amount) return
  
  await assetStore.addAsset({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    name: assetForm.name,
    category: assetForm.category,
    amount: assetForm.amount
  })
  
  // 重置表单并关闭
  assetForm.name = ''
  assetForm.category = '流动资金'
  assetForm.amount = ''
  showAddAssetModal.value = false
}

onMounted(async () => {
  try {
    await Promise.all([
      authStore.init(),
      expenseStore.init(),
      incomeStore.init(),
      assetStore.init()
    ])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
