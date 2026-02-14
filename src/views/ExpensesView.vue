<template>
  <div class="min-h-screen pb-24">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <h1 class="text-xl font-semibold text-text-primary">收入支出</h1>
        <button @click="showAddModal = true; addType = 'expense'" class="p-2 rounded-full bg-primary text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>
    
    <main class="px-6 py-6 space-y-6">
      <!-- 本月概览 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-text-primary">本月概览</h2>
        </div>
        
        <!-- 收支结余 -->
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center">
            <p class="text-sm text-text-tertiary mb-1">收入</p>
            <p class="text-lg font-semibold text-primary">¥{{ formatMoney(incomeStats.total) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-text-tertiary mb-1">支出</p>
            <p class="text-lg font-semibold text-accent">¥{{ formatMoney(expenseStats.total) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-text-tertiary mb-1">结余</p>
            <p class="text-lg font-semibold" :class="balance >= 0 ? 'text-primary' : 'text-accent'">
              ¥{{ formatMoney(balance) }}
            </p>
          </div>
        </div>
        
        <!-- 储蓄率 -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
          <span class="text-sm text-text-secondary">储蓄率</span>
          <div class="flex items-center gap-3">
            <div class="w-24 h-2 bg-border-light rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary rounded-full transition-all duration-500"
                :style="{ width: `${savingsRate}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium text-text-primary">{{ savingsRate.toFixed(1) }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 收入/支出切换 -->
      <div class="flex gap-2">
        <button 
          @click="activeTab = 'expense'"
          class="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
          :class="activeTab === 'expense' ? 'bg-accent text-white' : 'bg-bg-secondary text-text-secondary'"
        >
          支出明细
        </button>
        <button 
          @click="activeTab = 'income'"
          class="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
          :class="activeTab === 'income' ? 'bg-primary text-white' : 'bg-bg-secondary text-text-secondary'"
        >
          收入明细
        </button>
      </div>
      
      <!-- 支出明细 -->
      <div v-if="activeTab === 'expense'" class="space-y-4">
        <div 
          v-for="(amount, type) in expenseStats.byType" 
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
        
        <div v-if="Object.keys(expenseStats.byType).length === 0" class="text-center py-12">
          <p class="text-text-tertiary">本月还没有支出记录</p>
        </div>
      </div>
      
      <!-- 收入明细 -->
      <div v-if="activeTab === 'income'" class="space-y-4">
        <div 
          v-for="(amount, source) in incomeStats.bySource" 
          :key="source"
          class="card"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span class="text-primary text-sm">收</span>
              </div>
              <span class="font-medium text-text-primary">{{ source }}</span>
            </div>
            <span class="font-medium text-primary">¥{{ formatMoney(amount) }}</span>
          </div>
          
          <div class="space-y-2">
            <div 
              v-for="income in getIncomesBySource(source)" 
              :key="income.id"
              class="flex items-center justify-between py-2 border-t border-border-light"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm text-text-tertiary">{{ income.date.slice(-5) }}</span>
                <span class="text-sm text-text-secondary">{{ income.userName }}</span>
              </div>
              <span class="text-sm text-text-primary">¥{{ formatMoney(income.amount) }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="Object.keys(incomeStats.bySource).length === 0" class="text-center py-12">
          <p class="text-text-tertiary">本月还没有收入记录</p>
        </div>
      </div>
    </main>
    
    <!-- 添加弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6 animate-scale-in">
        <h2 class="text-xl font-semibold text-text-primary mb-6">{{ addType === 'expense' ? '记一笔支出' : '记一笔收入' }}</h2>
        
        <form @submit.prevent="handleAdd" class="space-y-4">
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
            <label class="block text-sm font-medium text-text-secondary mb-2">{{ addType === 'expense' ? '类型' : '来源' }}</label>
            <input 
              v-model="form.type"
              type="text" 
              class="input"
              :placeholder="addType === 'expense' ? '餐饮、交通、购物...' : '工资、投资、兼职...'"
              :list="addType === 'expense' ? 'expense-types' : 'income-sources'"
              required
            />
            <datalist v-if="addType === 'expense'" id="expense-types">
              <option value="餐饮" /><option value="交通" /><option value="购物" />
              <option value="娱乐" /><option value="生活" /><option value="房租" />
              <option value="保险" /><option value="人情" /><option value="旅游" />
              <option value="爱好" /><option value="备用" />
            </datalist>
            <datalist v-else id="income-sources">
              <option value="工资" /><option value="奖金" /><option value="投资" />
              <option value="兼职" /><option value="红包" /><option value="其他" />
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
            <button type="button" @click="showAddModal = false" class="btn-secondary flex-1">取消</button>
            <button type="submit" class="btn-primary flex-1">保存</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light safe-bottom">
      <div class="flex justify-around py-2">
        <router-link to="/" class="flex flex-col items-center p-2 text-text-tertiary hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1">资产负债</span>
        </router-link>
        
        <router-link to="/expenses" class="flex flex-col items-center p-2 text-primary">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { useExpenseStore } from '@/stores/expenses'
import { useIncomeStore } from '@/stores/incomes'
import { useAuthStore } from '@/stores/auth'

const expenseStore = useExpenseStore()
const incomeStore = useIncomeStore()
const authStore = useAuthStore()

const currentMonth = ref(format(new Date(), 'yyyy-MM'))
const activeTab = ref('expense')
const showAddModal = ref(false)
const addType = ref('expense')

const form = reactive({
  amount: '',
  type: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  notes: ''
})

const expenseStats = computed(() => expenseStore.getMonthlyStats(currentMonth.value))
const incomeStats = computed(() => incomeStore.getMonthlyStats(currentMonth.value))
const balance = computed(() => incomeStats.value.total - expenseStats.value.total)
const savingsRate = computed(() => incomeStats.value.total > 0 ? (balance.value / incomeStats.value.total) * 100 : 0)

function getExpensesByType(type) {
  return expenseStore.expenses
    .filter(e => e.date.startsWith(currentMonth.value) && e.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function getIncomesBySource(source) {
  return incomeStore.incomes
    .filter(i => i.date.startsWith(currentMonth.value) && i.source === source)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

async function handleAdd() {
  if (!authStore.currentUser) return
  
  if (addType.value === 'expense') {
    await expenseStore.addExpense({
      userId: authStore.currentUser.id,
      userName: authStore.currentUser.name,
      amount: form.amount,
      type: form.type,
      date: form.date,
      notes: form.notes
    })
  } else {
    await incomeStore.addIncome({
      userId: authStore.currentUser.id,
      userName: authStore.currentUser.name,
      amount: form.amount,
      source: form.type,
      date: form.date,
      notes: form.notes
    })
  }
  
  form.amount = ''
  form.type = ''
  form.notes = ''
  showAddModal.value = false
}

onMounted(async () => {
  await Promise.all([expenseStore.init(), incomeStore.init()])
})
</script>
