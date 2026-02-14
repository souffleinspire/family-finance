<template>
  <div class="min-h-screen pb-24">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <h1 class="text-xl font-semibold text-text-primary">财务目标</h1>
        <button @click="showAddModal = true" class="p-2 rounded-full bg-primary text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>
    
    <main class="px-6 py-6 space-y-6">
      <!-- 2026年预算概览 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">2026年预算</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center p-4 rounded-xl bg-bg-secondary">
            <p class="text-sm text-text-tertiary">年度预算</p>
            <p class="text-xl font-semibold text-text-primary">¥{{ formatMoney(totalBudget) }}</p>
          </div>
          <div class="text-center p-4 rounded-xl bg-bg-secondary">
            <p class="text-sm text-text-tertiary">月均预算</p>
            <p class="text-xl font-semibold text-text-primary">¥{{ formatMoney(monthlyBudget) }}</p>
          </div>
        </div>
        
        <!-- 预算类型列表 -->
        <div class="space-y-3">
          <div 
            v-for="(item, type) in budgetConfig.expenses" 
            :key="type"
            class="flex items-center justify-between p-3 rounded-xl bg-bg-secondary"
          >
            <span class="text-text-primary">{{ type }}</span>
            <span class="text-text-secondary">¥{{ formatMoney(item.monthly) }}/月</span>
          </div>
        </div>
      </div>
      
      <!-- 储蓄目标 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">储蓄目标</h2>
        <div class="space-y-4">
          <div 
            v-for="goal in goals" 
            :key="goal.id"
            class="p-4 rounded-xl bg-bg-secondary"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="font-medium text-text-primary">{{ goal.name }}</h3>
                <p class="text-sm text-text-tertiary">截止 {{ goal.deadline }}</p>
              </div>
              <span class="text-lg font-semibold text-primary">
                {{ (getProgress(goal.id) * 100).toFixed(0) }}%
              </span>
            </div>
            
            <div class="w-full h-3 bg-border-light rounded-full overflow-hidden">
              <div 
                class="h-full gradient-primary rounded-full transition-all duration-500"
                :style="{ width: `${getProgress(goal.id) * 100}%` }"
              ></div>
            </div>
            
            <div class="flex items-center justify-between mt-3">
              <div class="text-sm">
                <span class="text-text-tertiary">已存 </span>
                <span class="font-medium text-text-primary">¥{{ formatMoney(goal.currentAmount) }}</span>
              </div>
              <div class="text-sm">
                <span class="text-text-tertiary">还差 </span>
                <span class="font-medium text-accent">¥{{ formatMoney(goal.targetAmount - goal.currentAmount) }}</span>
              </div>
            </div>
            
            <!-- 快捷操作 -->
            <div class="flex gap-2 mt-4">
              <button 
                @click="showAddToGoal(goal)"
                class="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                + 存钱
              </button>
              <button 
                @click="editGoal(goal)"
                class="px-4 py-2 rounded-lg bg-bg-tertiary text-text-secondary text-sm hover:bg-border-light transition-colors"
              >
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 添加目标弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6 animate-scale-in">
        <h2 class="text-xl font-semibold text-text-primary mb-6">新建目标</h2>
        
        <form @submit.prevent="handleAddGoal" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">目标名称</label>
            <input 
              v-model="form.name"
              type="text" 
              class="input"
              placeholder="如：买房首付、欧洲旅行"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">目标金额</label>
            <input 
              v-model.number="form.targetAmount"
              type="number" 
              class="input"
              placeholder="0"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">已存金额</label>
            <input 
              v-model.number="form.currentAmount"
              type="number" 
              class="input"
              placeholder="0"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">截止日期</label>
            <input 
              v-model="form.deadline"
              type="date" 
              class="input"
              required
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="btn-secondary flex-1">
              取消
            </button>
            <button type="submit" class="btn-primary flex-1">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 存钱弹窗 -->
    <div v-if="showAddToModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-sm bg-bg-tertiary rounded-2xl shadow-soft-lg p-6 animate-scale-in">
        <h2 class="text-xl font-semibold text-text-primary mb-2">存钱到「{{ selectedGoal?.name }}」</h2>
        <p class="text-text-tertiary mb-6">当前：¥{{ formatMoney(selectedGoal?.currentAmount || 0) }}</p>
        
        <form @submit.prevent="handleAddToGoal" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">存入金额</label>
            <input 
              v-model.number="addAmount"
              type="number" 
              class="input"
              placeholder="0"
              required
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddToModal = false" class="btn-secondary flex-1">
              取消
            </button>
            <button type="submit" class="btn-primary flex-1">
              确定
            </button>
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
        
        <router-link to="/goals" class="flex flex-col items-center p-2 text-primary">
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
import { useGoalStore } from '@/stores/goals'

const goalStore = useGoalStore()

const showAddModal = ref(false)
const showAddToModal = ref(false)
const selectedGoal = ref(null)
const addAmount = ref('')

const form = reactive({
  name: '',
  targetAmount: '',
  currentAmount: 0,
  deadline: ''
})

const budgetConfig = computed(() => {
  return goalStore.budgetConfig2026
})

const totalBudget = computed(() => {
  return Object.values(budgetConfig.value.expenses)
    .reduce((sum, item) => sum + item.amount, 0)
})

const monthlyBudget = computed(() => {
  return Math.round(totalBudget.value / 12)
})

const goals = computed(() => {
  return goalStore.goals
})

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}

function getProgress(goalId) {
  return goalStore.getProgress(goalId)
}

function showAddToGoal(goal) {
  selectedGoal.value = goal
  addAmount.value = ''
  showAddToModal.value = true
}

function editGoal(goal) {
  // TODO: 实现编辑功能
  console.log('Edit goal:', goal)
}

async function handleAddGoal() {
  await goalStore.addGoal({
    name: form.name,
    targetAmount: form.targetAmount,
    currentAmount: form.currentAmount,
    deadline: form.deadline
  })
  
  // 重置表单
  form.name = ''
  form.targetAmount = ''
  form.currentAmount = 0
  form.deadline = ''
  showAddModal.value = false
}

async function handleAddToGoal() {
  if (!selectedGoal.value) return
  
  await goalStore.addToGoal(selectedGoal.value.id, addAmount.value)
  showAddToModal.value = false
}

onMounted(async () => {
  await goalStore.init()
})
</script>
