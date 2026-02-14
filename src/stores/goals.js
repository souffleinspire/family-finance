import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'

export const useGoalStore = defineStore('goals', () => {
  const goals = ref([])
  
  // 2025年预算配置（预设）
  const budgetConfig2026 = {
    expenses: {
      生活: { amount: 102000, monthly: 8500 },
      保险: { amount: 22000, monthly: 1833 },
      房租: { amount: 90600, monthly: 7550 },
      人情: { amount: 20000, monthly: 1667 },
      旅游: { amount: 20000, monthly: 1667 },
      爱好: { amount: 20000, monthly: 1667 },
      备用: { amount: 20000, monthly: 1667 }
    },
    incomes: {
      family: { monthly: 55667, yearly: 668000 }
    }
  }
  
  async function init() {
    goals.value = await db.getAll('goals')
    
    // 如果没有目标，添加默认的财务目标
    if (goals.value.length === 0) {
      await createDefaultGoals()
    }
  }
  
  async function createDefaultGoals() {
    const defaultGoals = [
      {
        id: uuidv4(),
        name: '买房首付',
        targetAmount: 500000,
        currentAmount: 320000,
        deadline: '2028-12-31',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: '欧洲旅行',
        targetAmount: 80000,
        currentAmount: 32000,
        deadline: '2026-12-31',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    for (const goal of defaultGoals) {
      await db.add('goals', goal)
      goals.value.push(goal)
    }
  }
  
  async function addGoal(data) {
    const goal = {
      id: uuidv4(),
      name: data.name,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
      deadline: data.deadline,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await db.add('goals', goal)
    goals.value.push(goal)
    
    return goal
  }
  
  async function updateGoal(id, updates) {
    const index = goals.value.findIndex(g => g.id === id)
    if (index === -1) return
    
    const updated = { 
      ...goals.value[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await db.put('goals', updated)
    goals.value[index] = updated
    
    return updated
  }
  
  async function deleteGoal(id) {
    await db.delete('goals', id)
    goals.value = goals.value.filter(g => g.id !== id)
  }
  
  async function addToGoal(id, amount) {
    const goal = goals.value.find(g => g.id === id)
    if (!goal) return
    
    await updateGoal(id, {
      currentAmount: goal.currentAmount + Number(amount)
    })
  }
  
  const activeGoals = computed(() => 
    goals.value.filter(g => g.status === 'active')
  )
  
  function getProgress(id) {
    const goal = goals.value.find(g => g.id === id)
    if (!goal) return 0
    return Math.min(goal.currentAmount / goal.targetAmount, 1)
  }
  
  return {
    goals,
    budgetConfig2026,
    activeGoals,
    init,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    getProgress
  }
})
