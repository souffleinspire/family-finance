import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref([])
  
  // 初始化
  async function init() {
    expenses.value = await db.getAll('expenses')
  }
  
  // 添加支出
  async function addExpense(data) {
    const expense = {
      id: uuidv4(),
      userId: data.userId,
      userName: data.userName,
      amount: Number(data.amount),
      type: data.type,
      subType: data.subType || null,
      date: data.date || format(new Date(), 'yyyy-MM-dd'),
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      syncStatus: 'pending'
    }
    
    await db.add('expenses', expense)
    expenses.value.push(expense)
    
    return expense
  }
  
  // 更新支出
  async function updateExpense(id, updates) {
    const index = expenses.value.findIndex(e => e.id === id)
    if (index === -1) return
    
    const updated = { ...expenses.value[index], ...updates }
    await db.put('expenses', updated)
    expenses.value[index] = updated
    
    return updated
  }
  
  // 删除支出
  async function deleteExpense(id) {
    await db.delete('expenses', id)
    expenses.value = expenses.value.filter(e => e.id !== id)
  }
  
  // 获取某月的支出
  function getExpensesByMonth(yearMonth) {
    return expenses.value.filter(e => e.date.startsWith(yearMonth))
  }
  
  // 获取某用户的支出
  function getExpensesByUser(userId) {
    return expenses.value.filter(e => e.userId === userId)
  }
  
  // 按月统计
  function getMonthlyStats(yearMonth) {
    const monthExpenses = getExpensesByMonth(yearMonth)
    
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    
    // 按类型分组统计
    const byType = {}
    monthExpenses.forEach(e => {
      if (!byType[e.type]) {
        byType[e.type] = 0
      }
      byType[e.type] += e.amount
    })
    
    // 按用户分组统计
    const byUser = {}
    monthExpenses.forEach(e => {
      if (!byUser[e.userName]) {
        byUser[e.userName] = 0
      }
      byUser[e.userName] += e.amount
    })
    
    return {
      total,
      byType,
      byUser,
      count: monthExpenses.length
    }
  }
  
  return {
    expenses,
    init,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByMonth,
    getExpensesByUser,
    getMonthlyStats
  }
})
