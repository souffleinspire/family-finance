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
      <h1 class="text-xl font-semibold text-text-primary mb-6">添加资产</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">名称</label>
          <input v-model="form.name" type="text" class="input" placeholder="如：招商银行活期" required />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">类别</label>
          <select v-model="form.category" class="input" required>
            <option value="活钱">活钱</option>
            <option value="稳健">稳健</option>
            <option value="长期">长期</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
          <input v-model.number="form.amount" type="number" class="input" placeholder="0" required />
        </div>
        
        <button type="submit" class="btn-primary w-full mt-6">保存</button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetStore } from '@/stores/assets'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const assetStore = useAssetStore()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  category: '活钱',
  amount: ''
})

async function handleSubmit() {
  if (!authStore.currentUser) return
  await assetStore.addAsset({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    name: form.name,
    category: form.category,
    amount: form.amount
  })
  router.push('/assets')
}
</script>
