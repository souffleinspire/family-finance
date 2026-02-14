import { ref, computed } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

export function useExpense() {
  const expenses = ref([])
  
  async function init() {
    expenses.value = await db.getAll('expenses')
  }
  
  async function add(data) {
    const expense = {
      id: uuidv4(),
      userId: data.userId,
      userName: data.userName,
      amount: Number(data.amount),
      type: data.type,
      date: data.date || format(new Date(), 'yyyy-MM-dd'),
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    }
    
    await db.add('expenses', expense)
    expenses.value.push(expense)
    return expense
  }
  
  async function remove(id) {
    await db.delete('expenses', id)
    expenses.value = expenses.value.filter(e => e.id !== id)
  }
  
  function getByMonth(yearMonth) {
    return expenses.value.filter(e => e.date.startsWith(yearMonth))
  }
  
  function getStats(yearMonth) {
    const list = getByMonth(yearMonth)
    const total = list.reduce((sum, e) => sum + e.amount, 0)
    const byType = {}
    const byUser = {}
    
    list.forEach(e => {
      byType[e.type] = (byType[e.type] || 0) + e.amount
      byUser[e.userName] = (byUser[e.userName] || 0) + e.amount
    })
    
    return { total, byType, byUser, count: list.length }
  }
  
  return { expenses, init, add, remove, getByMonth, getStats }
}
