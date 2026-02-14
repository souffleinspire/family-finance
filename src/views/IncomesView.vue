<template>
  <div class="min-h-screen pb-24">
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <router-link to="/" class="p-2 -ml-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold text-text-primary">收入记录</h1>
        <button @click="showAddModal = true" class="p-2 rounded-full bg-primary text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>
    
    <main class="px-6 py-6">
      <div class="card mb-6">
        <p class="text-sm text-text-tertiary mb-1">本月收入</p>
        <p class="text-2xl font-semibold text-primary">¥{{ formatMoney(monthStats.total) }}</p>
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="income in incomes" 
          :key="income.id"
          class="card flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span class="text-primary text-sm">收</span>
            </div>
            <div>
              <p class="font-medium text-text-primary">{{ income.source }}</p>
              <p class="text-xs text-text-tertiary">{{ income.date }} · {{ income.userName }}</p>
            </div>
          </div>
          <span class="font-medium text-primary">+¥{{ formatMoney(income.amount) }}</span>
        </div>
      </div>
      
      <div v-if="incomes.length === 0" class="text-center py-12">
        <p class="text-text-tertiary">还没有收入记录</p>
      </div>
    </main>
    
    <!-- 添加弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6">
        <h2 class="text-xl font-semibold text-text-primary mb-6">记一笔收入</h2>
        
        <form @submit.prevent="handleAdd" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
            <input v-model.number="form.amount" type="number" class="input" placeholder="0.00" required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">来源</label>
            <input v-model="form.source" type="text" class="input" placeholder="工资、奖金..." required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">日期</label>
            <input v-model="form.date" type="date" class="input" required />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="btn-secondary flex-1">取消</button>
            <button type="submit" class="btn-primary flex-1">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { useIncomeStore } from '@/stores/incomes'
import { useAuthStore } from '@/stores/auth'

const incomeStore = useIncomeStore()
const authStore = useAuthStore()

const currentMonth = ref('2026-02')
const showAddModal = ref(false)
const form = reactive({ amount: '', source: '', date: format(new Date(), 'yyyy-MM-dd') })

const monthStats = computed(() => incomeStore.getMonthlyStats(currentMonth.value))
const incomes = computed(() => 
  incomeStore.incomes.filter(i => i.date.startsWith(currentMonth.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
)

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

async function handleAdd() {
  if (!authStore.currentUser) return
  await incomeStore.addIncome({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    amount: form.amount,
    source: form.source,
    date: form.date
  })
  showAddModal.value = false
  form.amount = ''
  form.source = ''
}

onMounted(async () => { await incomeStore.init() })
</script>
