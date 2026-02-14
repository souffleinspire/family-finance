<template>
  <div class="min-h-screen pb-24">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <router-link to="/" class="p-2 -ml-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold text-text-primary">支出记录</h1>
        <button @click="showAddModal = true" class="p-2 rounded-full bg-primary text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>
    
    <main class="px-6 py-6">
      <!-- 月份选择 -->
      <div class="flex items-center justify-between mb-6">
        <button @click="changeMonth(-1)" class="p-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-lg font-medium text-text-primary">{{ currentMonth }}</span>
        <button @click="changeMonth(1)" class="p-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <!-- 统计卡片 -->
      <div class="card mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-text-tertiary">本月支出</p>
            <p class="text-2xl font-semibold text-accent">¥{{ formatMoney(monthStats.total) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-text-tertiary">共 {{ monthStats.count }} 笔</p>
            <p class="text-sm text-text-secondary">平均 ¥{{ formatMoney(avgAmount) }}</p>
          </div>
        </div>
      </div>
      
      <!-- 按类型分组 -->
      <div class="space-y-4">
        <div 
          v-for="(amount, type) in monthStats.byType" 
          :key="type"
          class="card"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <span class="text-accent text-sm">支</span>
              </div>
              <span class="font-medium text-text-primary">{{ type }}</span>
            </div>
            <span class="font-medium text-accent">¥{{ formatMoney(amount) }}</span>
          </div>
          
          <!-- 该类型的明细 -->
          <div class="space-y-2">
            <div 
              v-for="expense in getExpensesByType(type)" 
              :key="expense.id"
              class="flex items-center justify-between py-2 border-t border-border-light"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm text-text-tertiary">{{ expense.date.slice(-5) }}</span>
                <span class="text-sm text-text-secondary">{{ expense.userName }}</span>
              </div>
              <span class="text-sm text-text-primary">¥{{ formatMoney(expense.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="Object.keys(monthStats.byType).length === 0" class="text-center py-12">
        <p class="text-text-tertiary">本月还没有支出记录</p>
        <button @click="showAddModal = true" class="mt-4 btn-primary">
          去记账
        </button>
      </div>
    </main>
    
    <!-- 添加支出弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6 animate-scale-in">
        <h2 class="text-xl font-semibold text-text-primary mb-6">记一笔支出</h2>
        
        <form @submit.prevent="handleAddExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
            <input 
              v-model.number="form.amount"
              type="number" 
              class="input"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">类型</label>
            <input 
              v-model="form.type"
              type="text" 
              class="input"
              placeholder="餐饮、交通、购物..."
              list="expense-types"
              required
            />
            <datalist id="expense-types">
              <option value="餐饮" />
              <option value="交通" />
              <option value="购物" />
              <option value="娱乐" />
              <option value="生活" />
              <option value="房租" />
              <option value="保险" />
              <option value="人情" />
              <option value="旅游" />
              <option value="爱好" />
              <option value="备用" />
            </datalist>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">日期</label>
            <input 
              v-model="form.date"
              type="date" 
              class="input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">备注</label>
            <input 
              v-model="form.notes"
              type="text" 
              class="input"
              placeholder="可选"
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="btn-secondary flex-1">
              取消
            </button>
            <button type="submit" class="btn-accent flex-1">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { format, subMonths, addMonths } from 'date-fns'
import { useExpenseStore } from '@/stores/expenses'
import { useAuthStore } from '@/stores/auth'

const expenseStore = useExpenseStore()
const authStore = useAuthStore()

const currentMonth = ref(format(new Date(), 'yyyy-MM'))
const showAddModal = ref(false)

const form = reactive({
  amount: '',
  type: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  notes: ''
})

const monthStats = computed(() => {
  return expenseStore.getMonthlyStats(currentMonth.value)
})

const avgAmount = computed(() => {
  if (monthStats.value.count === 0) return 0
  return monthStats.value.total / monthStats.value.count
})

function changeMonth(delta) {
  const date = new Date(currentMonth.value + '-01')
  date.setMonth(date.getMonth() + delta)
  currentMonth.value = format(date, 'yyyy-MM')
}

function getExpensesByType(type) {
  return expenseStore.expenses
    .filter(e => e.date.startsWith(currentMonth.value) && e.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

async function handleAddExpense() {
  if (!authStore.currentUser) return
  
  await expenseStore.addExpense({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    amount: form.amount,
    type: form.type,
    date: form.date,
    notes: form.notes
  })
  
  // 重置表单
  form.amount = ''
  form.type = ''
  form.notes = ''
  showAddModal.value = false
}

onMounted(async () => {
  await expenseStore.init()
})
</script>
