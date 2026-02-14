import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

export class SyncManager {
  constructor() {
    this.currentUser = null
  }
  
  setUser(user) {
    this.currentUser = user
  }
  
  // 导出数据（生成 JSON 文件）
  async exportData() {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportedBy: this.currentUser?.name || 'unknown',
      users: await db.getAll('users'),
      expenses: await db.getAll('expenses'),
      incomes: await db.getAll('incomes'),
      assets: await db.getAll('assets'),
      goals: await db.getAll('goals')
    }
    
    // 记录导出历史
    await this.recordSync({
      type: 'export',
      recordCount: 
        data.expenses.length + 
        data.incomes.length + 
        data.assets.length,
      status: 'success'
    })
    
    return data
  }
  
  // 导入数据（合并策略）
  async importData(jsonData, options = {}) {
    const { skipUsers = true, skipGoals = true } = options
    const result = {
      expenses: { added: 0, skipped: 0 },
      incomes: { added: 0, skipped: 0 },
      assets: { added: 0, skipped: 0 },
      goals: { added: 0, skipped: 0 }
    }
    
    try {
      // 1. 合并用户（不覆盖，只添加新的）
      if (!skipUsers && jsonData.users) {
        const existingUsers = await db.getAll('users')
        const existingIds = new Set(existingUsers.map(u => u.id))
        
        for (const user of jsonData.users) {
          if (!existingIds.has(user.id)) {
            await db.add('users', user)
          }
        }
      }
      
      // 2. 合并支出
      if (jsonData.expenses) {
        const existingExpenses = await db.getAll('expenses')
        const existingIds = new Set(existingExpenses.map(e => e.id))
        
        for (const expense of jsonData.expenses) {
          if (existingIds.has(expense.id)) {
            result.expenses.skipped++
          } else {
            // 标记为已同步
            expense.syncStatus = 'synced'
            await db.add('expenses', expense)
            result.expenses.added++
          }
        }
      }
      
      // 3. 合并收入
      if (jsonData.incomes) {
        const existingIncomes = await db.getAll('incomes')
        const existingIds = new Set(existingIncomes.map(i => i.id))
        
        for (const income of jsonData.incomes) {
          if (existingIds.has(income.id)) {
            result.incomes.skipped++
          } else {
            income.syncStatus = 'synced'
            await db.add('incomes', income)
            result.incomes.added++
          }
        }
      }
      
      // 4. 合并资产
      if (jsonData.assets) {
        const existingAssets = await db.getAll('assets')
        const existingIds = new Set(existingAssets.map(a => a.id))
        
        for (const asset of jsonData.assets) {
          if (existingIds.has(asset.id)) {
            result.assets.skipped++
          } else {
            await db.add('assets', asset)
            result.assets.added++
          }
        }
      }
      
      // 5. 合并目标
      if (!skipGoals && jsonData.goals) {
        const existingGoals = await db.getAll('goals')
        const existingIds = new Set(existingGoals.map(g => g.id))
        
        for (const goal of jsonData.goals) {
          if (existingIds.has(goal.id)) {
            result.goals.skipped++
          } else {
            await db.add('goals', goal)
            result.goals.added++
          }
        }
      }
      
      // 记录导入历史
      const totalAdded = 
        result.expenses.added + 
        result.incomes.added + 
        result.assets.added
      
      await this.recordSync({
        type: 'import',
        recordCount: totalAdded,
        status: totalAdded > 0 ? 'success' : 'partial'
      })
      
      return {
        success: true,
        result
      }
    } catch (error) {
      await this.recordSync({
        type: 'import',
        recordCount: 0,
        status: 'failed'
      })
      
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 记录同步历史
  async recordSync(data) {
    const record = {
      id: uuidv4(),
      userId: this.currentUser?.id,
      userName: this.currentUser?.name,
      ...data,
      timestamp: new Date().toISOString()
    }
    
    await db.add('syncHistory', record)
    return record
  }
  
  // 获取同步历史
  async getSyncHistory() {
    const records = await db.getAll('syncHistory')
    return records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
}

export const syncManager = new SyncManager()
