import { defineStore } from 'pinia'
import { Utensils, Train, ShoppingBag, Music, HelpCircle } from 'lucide-vue-next'

export const categoryConfig = {
  '餐飲': { icon: Utensils, color: '#F87171', bg: 'bg-red-400', bgLight: 'bg-red-50', text: 'text-red-400' },
  '交通': { icon: Train, color: '#60A5FA', bg: 'bg-blue-400', bgLight: 'bg-blue-50', text: 'text-blue-400' },
  '購物': { icon: ShoppingBag, color: '#F472B6', bg: 'bg-pink-400', bgLight: 'bg-pink-50', text: 'text-pink-400' },
  '娛樂': { icon: Music, color: '#A78BFA', bg: 'bg-violet-400', bgLight: 'bg-violet-50', text: 'text-violet-400' },
  '其他': { icon: HelpCircle, color: '#94A3B8', bg: 'bg-slate-400', bgLight: 'bg-slate-50', text: 'text-slate-400' }
}

export const categories = Object.keys(categoryConfig)

export const useExpenseStore = defineStore('expense', {
  state: () => {
    const saved = localStorage.getItem('expenses')
    const data = saved ? JSON.parse(saved) : null
    
    return {
      budget: data?.budget ?? 100000,
      customRate: data?.customRate ?? 0.22,
      expenses: data?.expenses ?? []
    }
  },
  getters: {
    totalSpent(state) {
      return state.expenses.reduce((sum, item) => {
        return sum + (item.currency === 'JPY' ? item.amount : item.amount / state.customRate)
      }, 0)
    },
    totalSpentTWD(state) {
      return (this.totalSpent * state.customRate).toFixed(0)
    }
  },
  actions: {
    addExpense(item) {
      this.expenses.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString('en-CA'),
        currency: 'JPY',
        ...item
      })
      this.saveToLocalStorage()
    },
    updateRate(rate) {
      this.customRate = Number(rate)
      this.saveToLocalStorage()
    },
    deleteExpense(id) {
      this.expenses = this.expenses.filter(e => e.id !== id)
      this.saveToLocalStorage()
    },
    updateExpense(id, updatedData) {
      const index = this.expenses.findIndex(e => e.id === id)
      if (index !== -1) {
        this.expenses[index] = { ...this.expenses[index], ...updatedData }
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('expenses', JSON.stringify({
        budget: this.budget,
        customRate: this.customRate,
        expenses: this.expenses
      }))
    }
  }
})
