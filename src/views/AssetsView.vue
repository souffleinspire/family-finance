<template>
  <div class="min-h-screen pb-24">
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <router-link to="/" class="p-2 -ml-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold text-text-primary">资产</h1>
        <button @click="showAddModal = true" class="p-2 rounded-full bg-primary text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>
    
    <main class="px-6 py-6">
      <div class="card mb-6">
        <p class="text-sm text-text-tertiary mb-1">总资产</p>
        <p class="text-2xl font-semibold text-primary">¥{{ formatMoney(totalAssets) }}</p>
      </div>
      
      <div class="space-y-4">
        <div v-for="(amount, category) in byCategory" :key="category" class="card">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-text-primary">{{ category }}</span>
            <span class="text-primary">¥{{ formatMoney(amount) }}</span>
          </div>
          <div 
            v-for="asset in getAssetsByCategory(category)" 
            :key="asset.id"
            class="flex justify-between py-2 border-t border-border-light text-sm"
          >
            <span class="text-text-secondary">{{ asset.name }}</span>
            <span class="text-text-primary">¥{{ formatMoney(asset.amount) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="assets.length === 0" class="text-center py-12">
        <p class="text-text-tertiary">还没有资产记录</p>
      </div>
    </main>
    
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6">
        <h2 class="text-xl font-semibold text-text-primary mb-6">添加资产</h2>
        
        <form @submit.prevent="handleAdd" class="space-y-4">
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
import { useAssetStore } from '@/stores/assets'
import { useAuthStore } from '@/stores/auth'

const assetStore = useAssetStore()
const authStore = useAuthStore()

const showAddModal = ref(false)
const form = reactive({ name: '', category: '活钱', amount: '' })

const assets = computed(() => assetStore.assets)
const totalAssets = computed(() => assetStore.getTotalAssets())
const byCategory = computed(() => assetStore.getTotalByCategory())

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

function getAssetsByCategory(category) {
  return assets.value.filter(a => a.category === category)
}

async function handleAdd() {
  if (!authStore.currentUser) return
  await assetStore.addAsset({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    name: form.name,
    category: form.category,
    amount: form.amount
  })
  showAddModal.value = false
  form.name = ''
  form.amount = ''
}

onMounted(async () => { await assetStore.init() })
</script>
