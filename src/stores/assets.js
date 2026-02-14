import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

export const useAssetStore = defineStore('assets', () => {
  const assets = ref([])
  
  async function init() {
    assets.value = await db.getAll('assets')
  }
  
  async function addAsset(data) {
    const asset = {
      id: uuidv4(),
      userId: data.userId,
      userName: data.userName,
      name: data.name,
      category: data.category, // 活钱/稳健/长期
      type: data.type, // 流动资金/固定资产/投资理财/应收款
      amount: Number(data.amount),
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await db.add('assets', asset)
    assets.value.push(asset)
    
    return asset
  }
  
  async function updateAsset(id, updates) {
    const index = assets.value.findIndex(a => a.id === id)
    if (index === -1) return
    
    const updated = { 
      ...assets.value[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await db.put('assets', updated)
    assets.value[index] = updated
    
    return updated
  }
  
  async function deleteAsset(id) {
    await db.delete('assets', id)
    assets.value = assets.value.filter(a => a.id !== id)
  }
  
  // 按类别统计
  function getTotalByCategory() {
    const result = {}
    assets.value.forEach(a => {
      if (!result[a.category]) {
        result[a.category] = 0
      }
      result[a.category] += a.amount
    })
    return result
  }
  
  // 家庭总资产
  function getTotalAssets() {
    return assets.value.reduce((sum, a) => sum + a.amount, 0)
  }
  
  return {
    assets,
    init,
    addAsset,
    updateAsset,
    deleteAsset,
    getTotalByCategory,
    getTotalAssets
  }
})
