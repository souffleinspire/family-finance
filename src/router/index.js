import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('@/views/ExpensesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/add',
    name: 'AddExpense',
    component: () => import('@/views/AddExpenseView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/incomes',
    name: 'Incomes',
    component: () => import('@/views/IncomesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/incomes/add',
    name: 'AddIncome',
    component: () => import('@/views/AddIncomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/assets',
    name: 'Assets',
    component: () => import('@/views/AssetsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/assets/add',
    name: 'AddAsset',
    component: () => import('@/views/AddAssetView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('@/views/GoalsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sync',
    name: 'Sync',
    component: () => import('@/views/SyncView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
