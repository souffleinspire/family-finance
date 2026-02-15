<template>
  <!-- 添加资产弹窗 -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
    <div class="w-full max-w-md bg-bg-tertiary rounded-t-3xl shadow-soft-lg p-6 animate-slide-up">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">添加资产</h2>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-bg-secondary">
          <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">名称</label>
          <input v-model="form.name" type="text" class="input" placeholder="如：工资卡、房贷" required />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">类别</label>
          <div class="grid grid-cols-4 gap-2">
            <button 
              v-for="cat in categories" 
              :key="cat"
              type="button"
              @click="form.category = cat"
              class="py-3 rounded-xl text-sm font-medium transition-colors"
              :class="form.category === cat ? 'bg-primary text-white' : 'bg-bg-secondary text-text-secondary'"
            >
              {{ cat }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
          <input v-model.number="form.amount" type="number" class="input" placeholder="0" required />
        </div>
        
        <div class="flex gap-3 pt-4">
          <button type="button" @click="$emit('close')" class="btn-secondary flex-1">取消</button>
          <button type="submit" class="btn-primary flex-1">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAssetStore } from '@/stores/assets'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const assetStore = useAssetStore()
const authStore = useAuthStore()

const showModal = true
const categories = ['流动资金', '固定资产', '投资理财', '负债']

const form = reactive({
  name: '',
  category: '流动资金',
  amount: ''
})

async function handleSubmit() {
  if (!authStore.currentUser || !form.amount) return
  
  await assetStore.addAsset({
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    name: form.name,
    category: form.category,
    amount: form.amount
  })
  
  emit('close')
}
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
