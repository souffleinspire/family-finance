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
      <h1 class="text-xl font-semibold text-text-primary mb-6">记收入</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
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
        
        <button type="submit" class="btn-primary w-full mt-6">保存</button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useIncomeStore } from '@/stores/incomes'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const incomeStore = useIncomeStore()
const authStore = useAuthStore()

const form = reactive({
  amount: '',
  source: '',
  date: new Date().toISOString().split('T')[0]
})

async function handleSubmit() {
  if (!authStore.currentUser) return
  await incomeStore.addIncome({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    amount: form.amount,
    source: form.source,
    date: form.date
  })
  router.push('/incomes')
}
</script>
