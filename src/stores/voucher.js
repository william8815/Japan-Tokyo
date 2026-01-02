import { defineStore } from 'pinia'

export const useVoucherStore = defineStore('voucher', {
  state: () => ({
    vouchers: JSON.parse(localStorage.getItem('vouchers') || '[]')
  }),
  actions: {
    addVoucher(voucher) {
      this.vouchers.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        ...voucher
      })
      this.saveVouchers()
    },
    updateVoucher(id, updatedData) {
      const index = this.vouchers.findIndex(v => v.id === id)
      if (index !== -1) {
        this.vouchers[index] = { ...this.vouchers[index], ...updatedData }
        this.saveVouchers()
      }
    },
    deleteVoucher(id) {
      this.vouchers = this.vouchers.filter(v => v.id !== id)
      this.saveVouchers()
    },
    saveVouchers() {
      localStorage.setItem('vouchers', JSON.stringify(this.vouchers))
    }
  }
})
