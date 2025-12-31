import { defineStore } from 'pinia'

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    budget: 100000, // 初始預算 (JPY)
    exchangeRate: 0.22, // 匯率 (JPY to TWD)
    expenses: []
  }),
  getters: {
    totalSpent(state) {
      return state.expenses.reduce((sum, item) => sum + item.amount, 0)
    },
    remainingBudget(state) {
      return state.budget - this.totalSpent
    },
    totalSpentTWD() {
      return (this.totalSpent * this.exchangeRate).toFixed(0)
    }
  },
  actions: {
    addExpense(item) {
      this.expenses.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        ...item
      })
    },
    removeExpense(id) {
      this.expenses = this.expenses.filter(e => e.id !== id)
    }
  }
})
