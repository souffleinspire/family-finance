import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

export const useIncomeStore = defineStore('incomes', () => {
  const incomes = ref([])
  
  async function init() {
    incomes.value = await db.getAll('incomes')
  }
  
  async function addIncome(data) {
    const income = {
      id: uuidv4(),
      userId: data.userId,
      userName: data.userName,
      amount: Number(data.amount),
      source: data.source,
      date: data.date || format(new Date(), 'yyyy-MM-dd'),
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      syncStatus: 'pending'
    }
    
    await db.add('incomes', income)
    incomes.value.push(income)
    
    return income
  }
  
  async function updateIncome(id, updates) {
    const index = incomes.value.findIndex(i => i.id === id)
    if (index === -1) return
    
    const updated = { ...incomes.value[index], ...updates }
    await db.put('incomes', updated)
    incomes.value[index] = updated
    
    return updated
  }
  
  async function deleteIncome(id) {
    await db.delete('incomes', id)
    incomes.value = incomes.value.filter(i => i.id !== id)
  }
  
  function getIncomesByMonth(yearMonth) {
    return incomes.value.filter(i => i.date.startsWith(yearMonth))
  }
  
  function getMonthlyStats(yearMonth) {
    const monthIncomes = getIncomesByMonth(yearMonth)
    const total = monthIncomes.reduce((sum, i) => sum + i.amount, 0)
    
    const byUser = {}
    monthIncomes.forEach(i => {
      if (!byUser[i.userName]) {
        byUser[i.userName] = 0
      }
      byUser[i.userName] += i.amount
    })
    
    return { total, byUser, count: monthIncomes.length }
  }
  
  return {
    incomes,
    init,
    addIncome,
    updateIncome,
    deleteIncome,
    getIncomesByMonth,
    getMonthlyStats
  }
})
