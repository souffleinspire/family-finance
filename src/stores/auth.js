import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/utils/database'
import { v4 as uuidv4 } from 'uuid'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const users = ref([])
  
  const isAuthenticated = computed(() => !!currentUser.value)
  
  // 初始化
  async function init() {
    users.value = await db.getAll('users')
    
    // 检查是否有记住的登录状态
    const savedUserId = localStorage.getItem('family-finance-userId')
    if (savedUserId) {
      const user = await db.get('users', savedUserId)
      if (user) {
        currentUser.value = user
      }
    }
  }
  
  // 密码加密（简化版，实际项目应使用更安全的方式）
  function hashPassword(password) {
    // 这里使用简化处理，生产环境应使用 bcrypt
    return btoa(password)
  }
  
  // 注册
  async function register(name, password) {
    // 检查用户名是否已存在（重新从数据库获取最新数据）
    const allUsers = await db.getAll('users')
    const existingUser = allUsers.find(u => u.name === name)
    if (existingUser) {
      throw new Error('用户名已存在')
    }
    
    const user = {
      id: uuidv4(),
      name,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      lastSyncAt: null
    }
    
    await db.add('users', user)
    users.value = allUsers.concat(user)  // 更新本地缓存
    
    return user
  }
  
  // 登录
  async function login(name, password) {
    const user = users.value.find(u => u.name === name)
    
    if (!user) {
      throw new Error('用户不存在')
    }
    
    if (user.passwordHash !== hashPassword(password)) {
      throw new Error('密码错误')
    }
    
    currentUser.value = user
    localStorage.setItem('family-finance-userId', user.id)
    
    return user
  }
  
  // 登出
  function logout() {
    currentUser.value = null
    localStorage.removeItem('family-finance-userId')
  }
  
  // 更新用户信息
  async function updateUser(updates) {
    if (!currentUser.value) return
    
    const updatedUser = { ...currentUser.value, ...updates }
    await db.put('users', updatedUser)
    
    const index = users.value.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }
    
    currentUser.value = updatedUser
  }
  
  // 获取所有用户（用于家庭成员选择）
  function getAllUsers() {
    return users.value
  }
  
  return {
    currentUser,
    users,
    isAuthenticated,
    init,
    register,
    login,
    logout,
    updateUser,
    getAllUsers
  }
})
