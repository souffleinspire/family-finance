import { db } from '@/utils/database'

export class BackupManager {
  // 创建完整备份
  async createBackup() {
    const data = {
      version: '1.0',
      backupDate: new Date().toISOString(),
      users: await db.getAll('users'),
      expenses: await db.getAll('expenses'),
      incomes: await db.getAll('incomes'),
      assets: await db.getAll('assets'),
      liabilities: await db.getAll('liabilities'),
      insurances: await db.getAll('insurances'),
      goals: await db.getAll('goals'),
      expenseTypes: await db.getAll('expenseTypes'),
      incomeSources: await db.getAll('incomeSources'),
      syncHistory: await db.getAll('syncHistory')
    }
    
    return data
  }
  
  // 从备份恢复
  async restoreFromBackup(data, options = {}) {
    const { replace = false } = options
    
    if (!data.users || !data.version) {
      throw new Error('无效的备份文件')
    }
    
    if (replace) {
      // 清空所有数据
      await db.clear('users')
      await db.clear('expenses')
      await db.clear('incomes')
      await db.clear('assets')
      await db.clear('liabilities')
      await db.clear('insurances')
      await db.clear('goals')
      await db.clear('expenseTypes')
      await db.clear('incomeSources')
      await db.clear('syncHistory')
    }
    
    // 恢复数据
    if (data.users) {
      for (const user of data.users) {
        await db.put('users', user)
      }
    }
    
    if (data.expenses) {
      for (const expense of data.expenses) {
        await db.put('expenses', expense)
      }
    }
    
    if (data.incomes) {
      for (const income of data.incomes) {
        await db.put('incomes', income)
      }
    }
    
    if (data.assets) {
      for (const asset of data.assets) {
        await db.put('assets', asset)
      }
    }
    
    if (data.liabilities) {
      for (const liability of data.liabilities) {
        await db.put('liabilities', liability)
      }
    }
    
    if (data.insurances) {
      for (const insurance of data.insurances) {
        await db.put('insurances', insurance)
      }
    }
    
    if (data.goals) {
      for (const goal of data.goals) {
        await db.put('goals', goal)
      }
    }
    
    if (data.expenseTypes) {
      for (const type of data.expenseTypes) {
        await db.put('expenseTypes', type)
      }
    }
    
    if (data.incomeSources) {
      for (const source of data.incomeSources) {
        await db.put('incomeSources', source)
      }
    }
    
    return { success: true }
  }
  
  // 下载备份文件
  downloadBackup(data) {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `family-finance-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  // 解析备份文件
  parseBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          resolve(data)
        } catch (error) {
          reject(new Error('无法解析备份文件'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('读取文件失败'))
      }
      
      reader.readAsText(file)
    })
  }
}

export const backupManager = new BackupManager()
