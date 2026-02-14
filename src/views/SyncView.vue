<template>
  <div class="min-h-screen pb-24">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-lg safe-top">
      <div class="flex items-center justify-between px-6 py-4">
        <h1 class="text-xl font-semibold text-text-primary">保险</h1>
        <div class="w-10"></div>
      </div>
    </header>
    
    <main class="px-6 py-6 space-y-6">
      <!-- 同步说明 -->
      <div class="card bg-primary/5 border border-primary/20">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-text-primary mb-1">保险管理</h3>
            <p class="text-sm text-text-secondary">
              记录和管理家庭保险信息，随时查看保障情况。
            </p>
          </div>
        </div>
      </div>
      
      <!-- 保险列表 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">我的保险</h2>
        <p class="text-sm text-text-tertiary mb-4">
          添加和管理家庭保险保单。
        </p>
        <button @click="showAddModal = true" class="btn-primary w-full">
          添加保险
        </button>
      </div>
      
      <!-- 保险类型统计 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">保障概览</h2>
        <p class="text-sm text-text-tertiary">
          暂无保险数据，点击上方添加保险保单。
        </p>
      </div>
    </main>
    
    <!-- 添加保险弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6">
        <h2 class="text-xl font-semibold text-text-primary mb-6">添加保险</h2>
        
        <form @submit.prevent="handleAdd" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">保险名称</label>
            <input v-model="form.name" type="text" class="input" placeholder="例如：平安福、重疾险" required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">保险类型</label>
            <select v-model="form.type" class="input" required>
              <option value="">请选择</option>
              <option value="重疾险">重疾险</option>
              <option value="医疗险">医疗险</option>
              <option value="意外险">意外险</option>
              <option value="寿险">寿险</option>
              <option value="车险">车险</option>
              <option value="其他">其他</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">保额</label>
            <input v-model.number="form.coverage" type="number" class="input" placeholder="500000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">年缴保费</label>
            <input v-model.number="form.premium" type="number" class="input" placeholder="10000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">投保人</label>
            <input v-model="form.holder" type="text" class="input" placeholder="家庭成员姓名" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">到期日期</label>
            <input v-model="form.expiryDate" type="date" class="input" />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="btn-secondary flex-1">取消</button>
            <button type="submit" class="btn-primary flex-1">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showAddModal = ref(false)
const form = reactive({
  name: '',
  type: '',
  coverage: null,
  premium: null,
  holder: '',
  expiryDate: ''
})

function handleAdd() {
  console.log('添加保险:', form)
  showAddModal.value = false
}

onMounted(() => {
  authStore.init()
})
</script>
          :disabled="backingUp"
          class="btn-secondary w-full"
        >
          {{ backingUp ? '备份中...' : '创建备份' }}
        </button>
      </div>
      
      <!-- 同步历史 -->
      <div class="card">
        <h2 class="text-lg font-medium text-text-primary mb-4">📋 同步历史</h2>
        
        <div v-if="syncHistory.length === 0" class="text-center py-8">
          <p class="text-text-tertiary">还没有同步记录</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="record in syncHistory" 
            :key="record.id"
            class="flex items-center justify-between p-3 rounded-xl bg-bg-secondary"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                :class="record.type === 'export' ? 'bg-primary/20' : 'bg-accent/20'"
              >
                <span v-if="record.type === 'export'" class="text-primary">📤</span>
                <span v-else class="text-accent">📥</span>
              </div>
              <div>
                <p class="text-sm font-medium text-text-primary">
                  {{ record.type === 'export' ? '导出' : '导入' }}
                </p>
                <p class="text-xs text-text-tertiary">
                  {{ formatDate(record.timestamp) }}
                </p>
              </div>
            </div>
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="record.status === 'success' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'"
            >
              {{ record.status === 'success' ? '成功' : '部分' }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useAuthStore } from '@/stores/auth'
import { syncManager } from '@/utils/sync'
import { backupManager } from '@/utils/backup'

const authStore = useAuthStore()

const exporting = ref(false)
const importing = ref(false)
const backingUp = ref(false)
const syncHistory = ref([])

async function handleExport() {
  exporting.value = true
  
  try {
    syncManager.setUser(authStore.currentUser)
    const data = await syncManager.exportData()
    
    // 下载文件
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `family-finance-sync-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    await loadSyncHistory()
  } catch (error) {
    console.error('Export failed:', error)
    alert('导出失败：' + error.message)
  } finally {
    exporting.value = false
  }
}

async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  
  importing.value = true
  
  try {
    const data = await backupManager.parseBackupFile(file)
    
    // 确认导入
    if (!confirm('确定要导入数据吗？现有数据将与导入的数据合并。')) {
      return
    }
    
    syncManager.setUser(authStore.currentUser)
    const result = await syncManager.importData(data)
    
    if (result.success) {
      alert(`导入成功！\n新增记录：${result.result.expenses.added + result.result.incomes.added + result.result.assets.added}`)
      await loadSyncHistory()
    } else {
      alert('导入失败：' + result.error)
    }
  } catch (error) {
    console.error('Import failed:', error)
    alert('导入失败：' + error.message)
  } finally {
    importing.value = false
    event.target.value = ''
  }
}

async function handleBackup() {
  backingUp.value = true
  
  try {
    const data = await backupManager.createBackup()
    backupManager.downloadBackup(data)
    alert('备份创建成功！')
  } catch (error) {
    console.error('Backup failed:', error)
    alert('备份失败：' + error.message)
  } finally {
    backingUp.value = false
  }
}

async function loadSyncHistory() {
  syncHistory.value = await syncManager.getSyncHistory()
}

function formatDate(dateStr) {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

onMounted(async () => {
  await authStore.init()
  await loadSyncHistory()
})
</script>
