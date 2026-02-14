import { openDB } from 'idb'

const DB_NAME = 'family-finance-db'
const DB_VERSION = 1

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // 用户表
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' })
          userStore.createIndex('name', 'name', { unique: false })
        }
        
        // 支出表
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' })
          expenseStore.createIndex('userId', 'userId', { unique: false })
          expenseStore.createIndex('date', 'date', { unique: false })
          expenseStore.createIndex('type', 'type', { unique: false })
          expenseStore.createIndex('createdAt', 'createdAt', { unique: false })
        }
        
        // 收入表
        if (!db.objectStoreNames.contains('incomes')) {
          const incomeStore = db.createObjectStore('incomes', { keyPath: 'id' })
          incomeStore.createIndex('userId', 'userId', { unique: false })
          incomeStore.createIndex('date', 'date', { unique: false })
          incomeStore.createIndex('source', 'source', { unique: false })
        }
        
        // 资产表
        if (!db.objectStoreNames.contains('assets')) {
          const assetStore = db.createObjectStore('assets', { keyPath: 'id' })
          assetStore.createIndex('userId', 'userId', { unique: false })
          assetStore.createIndex('category', 'category', { unique: false })
        }
        
        // 负债表
        if (!db.objectStoreNames.contains('liabilities')) {
          const liabilityStore = db.createObjectStore('liabilities', { keyPath: 'id' })
          liabilityStore.createIndex('userId', 'userId', { unique: false })
        }
        
        // 保险表
        if (!db.objectStoreNames.contains('insurances')) {
          const insuranceStore = db.createObjectStore('insurances', { keyPath: 'id' })
          insuranceStore.createIndex('userId', 'userId', { unique: false })
          insuranceStore.createIndex('type', 'type', { unique: false })
        }
        
        // 目标表
        if (!db.objectStoreNames.contains('goals')) {
          const goalStore = db.createObjectStore('goals', { keyPin: 'id' })
          goalStore.createIndex('status', 'status', { unique: false })
        }
        
        // 支出类型表
        if (!db.objectStoreNames.contains('expenseTypes')) {
          db.createObjectStore('expenseTypes', { keyPath: 'id' })
        }
        
        // 收入类型表
        if (!db.objectStoreNames.contains('incomeSources')) {
          db.createObjectStore('incomeSources', { keyPath: 'id' })
        }
        
        // 同步历史表
        if (!db.objectStoreNames.contains('syncHistory')) {
          const syncStore = db.createObjectStore('syncHistory', { keyPath: 'id' })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }
  return dbPromise
}

// 通用 CRUD 操作
export const db = {
  // 添加记录
  async add(storeName, data) {
    const db = await getDB()
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data for add operation')
    }
    return db.add(storeName, data)
  },
  
  // 获取单条记录
  async get(storeName, id) {
    const db = await getDB()
    return db.get(storeName, id)
  },
  
  // 获取所有记录
  async getAll(storeName) {
    const db = await getDB()
    return db.getAll(storeName)
  },
  
  // 更新记录
  async put(storeName, data) {
    const db = await getDB()
    return db.put(storeName, data)
  },
  
  // 删除记录
  async delete(storeName, id) {
    const db = await getDB()
    return db.delete(storeName, id)
  },
  
  // 按索引查询
  async getByIndex(storeName, indexName, value) {
    const db = await getDB()
    return db.getAllFromIndex(storeName, indexName, value)
  },
  
  // 清空表
  async clear(storeName) {
    const db = await getDB()
    return db.clear(storeName)
  }
}

export default db
