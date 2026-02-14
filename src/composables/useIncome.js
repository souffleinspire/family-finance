import { ref, computed } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

export function useIncome() {
  const incomes = ref([])
  
  async function init() {
    incomes.value = await db.getAll('incomes')
  }
  
  async function add(data) {
    const income = {
      id: uuidv4(),
      userId: data.userId,
      userName: data.userName,
      amount: Number(data.amount),
      source: data.source,
      date: data.date || format(new Date(), 'yyyy-MM-dd'),
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    }
    
    await db.add('incomes', income)
    incomes.value.push(income)
    return income
  }
  
  async function remove(id) {
    await db.delete('incomes', id)
    incomes.value = incomes.value.filter(i => i.id !== id)
  }
  
  function getByMonth(yearMonth) {
    return incomes.value.filter(i => i.date.startsWith(yearMonth))
  }
  
  function getStats(yearMonth) {
    const list = getByMonth(yearMonth)
    const total = list.reduce((sum, i) => sum + i.amount, 0)
    const byUser = {}
    
    list.forEach(i => {
      byUser[i.userName] = (byUser[i.userName] || 0) + i.amount
    })
    
    return { total, byUser, count: list.length }
  }
  
  return { incomes, init, add, remove, getByMonth, getStats }
}
