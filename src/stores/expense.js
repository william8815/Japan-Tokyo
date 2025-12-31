import { defineStore } from 'pinia'

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    budget: 100000, 
    customRate: 0.22, // 使用者自定義匯率
    expenses: []
  }),
  getters: {
    totalSpent(state) {
      return state.expenses.reduce((sum, item) => {
        // 如果是日幣紀錄，直接加總；如果是台幣紀錄，按匯率換算回日幣存儲(或統一在顯示時處理)
        // 為了簡單起見，我們統一以「輸入幣別」記錄，計算時再換算
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
        date: new Date().toLocaleDateString(),
        currency: 'JPY', // 預設 JPY
        ...item
      })
    },
    updateRate(rate) {
      this.customRate = Number(rate)
    }
  }
})
