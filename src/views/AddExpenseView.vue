<template>
  <div class="min-h-screen">
    <header class="bg-bg-primary safe-top p-6">
      <button @click="$router.back()" class="flex items-center gap-2 text-text-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>
    </header>
    
    <main class="p-6">
      <div class="card">
        <h1 class="text-xl font-semibold text-text-primary mb-6">记一笔</h1>
        
        <!-- 类型选择 -->
        <div class="grid grid-cols-4 gap-3 mb-6">
          <button 
            @click="form.type = '支出'"
            class="p-4 rounded-xl text-center transition-all"
            :class="form.type === '支出' ? 'bg-accent text-white' : 'bg-bg-secondary text-text-primary'"
          >
            <span class="block text-lg mb-1">💸</span>
            <span class="text-sm">支出</span>
          </button>
          <button 
            @click="form.type = '收入'"
            class="p-4 rounded-xl text-center transition-all"
            :class="form.type === '收入' ? 'bg-primary text-white' : 'bg-bg-secondary text-text-primary'"
          >
            <span class="block text-lg mb-1">💰</span>
            <span class="text-sm">收入</span>
          </button>
          <button 
            @click="form.type = '资产'"
            class="p-4 rounded-xl text-center transition-all"
            :class="form.type === '资产' ? 'bg-primary text-white' : 'bg-bg-secondary text-text-primary'"
          >
            <span class="block text-lg mb-1">🏠</span>
            <span class="text-sm">资产</span>
          </button>
          <button 
            @click="form.type = '负债'"
            class="p-4 rounded-xl text-center transition-all"
            :class="form.type === '负债' ? 'bg-primary text-white' : 'bg-bg-secondary text-text-primary'"
          >
            <span class="block text-lg mb-1">📋</span>
            <span class="text-sm">负债</span>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
            <input 
              v-model.number="form.amount"
              type="number" 
              class="input text-center text-2xl"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">类型</label>
            <input 
              v-model="form.expenseType"
              type="text" 
              class="input"
              placeholder="餐饮、交通..."
              list="types"
            />
            <datalist id="types">
              <option value="餐饮" />
              <option value="交通" />
              <option value="购物" />
              <option value="娱乐" />
              <option value="生活" />
              <option value="房租" />
            </datalist>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">日期</label>
            <input v-model="form.date" type="date" class="input" required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">备注</label>
            <input v-model="form.notes" type="text" class="input" placeholder="可选" />
          </div>
          
          <button type="submit" class="btn-primary w-full mt-6">
            保存
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { useExpenseStore } from '@/stores/expenses'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const expenseStore = useExpenseStore()
const authStore = useAuthStore()

const form = reactive({
  type: '支出',
  amount: '',
  expenseType: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  notes: ''
})

async function handleSubmit() {
  if (!authStore.currentUser) {
    router.push('/login')
    return
  }
  
  if (form.type === '支出') {
    await expenseStore.addExpense({
      userId: authStore.currentUser.id,
      userName: authStore.currentUser.name,
      amount: form.amount,
      type: form.expenseType,
      date: form.date,
      notes: form.notes
    })
  }
  
  router.push('/expenses')
}
</script>
