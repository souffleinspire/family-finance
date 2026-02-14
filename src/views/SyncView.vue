<template>
  <div class="min-h-screen pb-24">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <h1 class="text-xl font-semibold text-text-primary">保险</h1>
        <div class="w-10"></div>
      </div>
    </header>
    
    <main class="px-6 py-6 space-y-6">
      <!-- 说明 -->
      <div class="card bg-primary/5 border border-primary/20">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-text-primary mb-1">保险管理</h3>
            <p class="text-sm text-text-secondary">
              记录和管理家庭保险信息，随时查看保障情况。
            </p>
          </div>
        </div>
      </div>
      
      <!-- 保险列表 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">我的保险</h2>
        <p class="text-sm text-text-tertiary mb-4">
          添加和管理家庭保险保单。
        </p>
        <button @click="showAddModal = true" class="btn-primary w-full">
          添加保险
        </button>
      </div>
      
      <!-- 保障概览 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">保障概览</h2>
        <p class="text-sm text-text-tertiary">
          暂无保险数据，点击上方添加保险保单。
        </p>
      </div>
    </main>
    
    <!-- 添加保险弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6">
        <h2 class="text-xl font-semibold text-text-primary mb-6">添加保险</h2>
        
        <form @submit.prevent="handleAdd" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">保险名称</label>
            <input v-model="form.name" type="text" class="input" placeholder="例如：平安福、重疾险" required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">保险类型</label>
            <select v-model="form.type" class="input" required>
              <option value="">请选择</option>
              <option value="重疾险">重疾险</option>
              <option value="医疗险">医疗险</option>
              <option value="意外险">意外险</option>
              <option value="寿险">寿险</option>
              <option value="车险">车险</option>
              <option value="其他">其他</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">保额</label>
            <input v-model.number="form.coverage" type="number" class="input" placeholder="500000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">年缴保费</label>
            <input v-model.number="form.premium" type="number" class="input" placeholder="10000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">投保人</label>
            <input v-model="form.holder" type="text" class="input" placeholder="家庭成员姓名" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">到期日期</label>
            <input v-model="form.expiryDate" type="date" class="input" />
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
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showAddModal = ref(false)
const form = reactive({
  name: '',
  type: '',
  coverage: null,
  premium: null,
  holder: '',
  expiryDate: ''
})

function handleAdd() {
  console.log('添加保险:', form)
  showAddModal.value = false
}

onMounted(() => {
  authStore.init()
})
</script>
