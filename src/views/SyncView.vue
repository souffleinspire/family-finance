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
    
    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light safe-bottom">
      <div class="flex justify-around py-2">
        <router-link to="/" class="flex flex-col items-center p-2 text-text-tertiary hover:text-primary">
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
        
        <router-link to="/sync" class="flex flex-col items-center p-2 text-primary">
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
