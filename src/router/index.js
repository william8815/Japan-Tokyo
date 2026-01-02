import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/itinerary',
    name: 'Itinerary',
    component: () => import('../views/Itinerary.vue')
  },
  {
    path: '/checklist',
    name: 'Checklist',
    component: () => import('../views/Checklist.vue')
  },
  {
    path: '/expense',
    name: 'Expense',
    component: () => import('../views/Expense.vue')
  },
  {
    path: '/expense/analysis',
    name: 'ExpenseAnalysis',
    component: () => import('../views/ExpenseAnalysis.vue')
  },
  {
    path: '/assistant',
    name: 'Assistant',
    component: () => import('../views/Assistant.vue')
  },
  {
    path: '/assistant/phrases',
    name: 'JapanesePhrases',
    component: () => import('../views/JapanesePhrases.vue')
  },
  {
    path: '/assistant/vouchers',
    name: 'Vouchers',
    component: () => import('../views/Vouchers.vue')
  },
  {
    path: '/weather',
    name: 'Weather',
    component: () => import('../views/Weather.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
