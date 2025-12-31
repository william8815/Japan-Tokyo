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
    path: '/expense',
    name: 'Expense',
    component: () => import('../views/Expense.vue')
  },
  {
    path: '/vouchers',
    name: 'Vouchers',
    component: () => import('../views/Vouchers.vue')
  },
  {
    path: '/assistant',
    name: 'Assistant',
    component: () => import('../views/Assistant.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
