import { ref, computed } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'

export function useGoal() {
  const goals = ref([])
  
  const defaultBudget = {
    expenses: {
      生活: { amount: 102000, monthly: 8500 },
      保险: { amount: 22000, monthly: 1833 },
      房租: { amount: 90600, monthly: 7550 },
      人情: { amount: 20000, monthly: 1667 },
      旅游: { amount: 20000, monthly: 1667 },
      爱好: { amount: 20000, monthly: 1667 },
      备用: { amount: 20000, monthly: 1667 }
    }
  }
  
  async function init() {
    goals.value = await db.getAll('goals')
  }
  
  async function add(data) {
    const goal = {
      id: uuidv4(),
      name: data.name,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
      deadline: data.deadline,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    await db.add('goals', goal)
    goals.value.push(goal)
    return goal
  }
  
  async function update(id, data) {
    const index = goals.value.findIndex(g => g.id === id)
    if (index === -1) return
    
    const updated = { ...goals.value[index], ...data, updatedAt: new Date().toISOString() }
    await db.put('goals', updated)
    goals.value[index] = updated
  }
  
  async function addAmount(id, amount) {
    const goal = goals.value.find(g => g.id === id)
    if (goal) {
      await update(id, { currentAmount: goal.currentAmount + Number(amount) })
    }
  }
  
  const active = computed(() => goals.value.filter(g => g.status === 'active'))
  
  function progress(id) {
    const goal = goals.value.find(g => g.id === id)
    if (!goal) return 0
    return Math.min(goal.currentAmount / goal.targetAmount, 1)
  }
  
  return { goals, defaultBudget, active, init, add, update, addAmount, progress }
}
