import { defineStore } from 'pinia'

export const useChecklistStore = defineStore('checklist', {
  state: () => {
    const defaultGroups = [
      {
        id: 'luggage',
        name: '行李物資',
        items: [
          { id: 1, text: '日幣現金', completed: false },
          { id: 2, text: '充電線與行動電源', completed: false },
          { id: 3, text: '換洗衣物 (5套)', completed: false },
          { id: 4, text: '睡衣 (2套)', completed: false },
          { id: 5, text: '襪子 (5套)', completed: false },
          { id: 6, text: '毛帽、厚外套', completed: false },
          { id: 7, text: '個人藥品', completed: false },
          { id: 8, text: '護照', completed: false },
          { id: 9, text: '驗光單', completed: false },
          { id: 10, text: '雨傘', completed: false },
          { id: 11, text: '拖鞋', completed: false },
        ]
      },
      {
        id: 'tasks',
        name: '出發前待辦',
        items: [
          { id: 101, text: '購買來回機票', completed: false },
          { id: 102, text: '購買旅平險', completed: false },
          { id: 103, text: '辦好電信漫遊或 e-SIM', completed: false },
          { id: 104, text: 'Tabelog 預定 敘敘苑 (晴空塔店)', completed: false },
          { id: 105, text: 'Tabelog 預定 牛舌的檸檬 (新宿)', completed: false },
          { id: 106, text: '購買 墨田水族館 票券', completed: false },
          { id: 107, text: '購買 箱根週遊券 (2日)', completed: false },
          { id: 108, text: '填寫 Visit Japan Web', completed: false },
          { id: 109, text: 'PayPay 電子錢包', completed: false }
        ]
      }
    ]

    // 從 localStorage 讀取
    const saved = localStorage.getItem('checklist')
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        return { groups: savedData.groups || defaultGroups }
      } catch (e) {
        console.error('Failed to load checklist from localStorage:', e)
      }
    }

    return { groups: defaultGroups }
  },
  getters: {
    totalProgress(state) {
      const allItems = state.groups.flatMap(g => g.items)
      if (allItems.length === 0) return 0
      const completed = allItems.filter(i => i.completed).length
      return Math.round((completed / allItems.length) * 100)
    }
  },
  actions: {
    toggleItem(groupId, itemId) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        const item = group.items.find(i => i.id === itemId)
        if (item) {
          item.completed = !item.completed
          this.saveToLocalStorage()
        }
      }
    },
    addItem(groupId, text) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        group.items.push({ id: Date.now(), text, completed: false })
        this.saveToLocalStorage()
      }
    },
    removeItem(groupId, itemId) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        group.items = group.items.filter(i => i.id !== itemId)
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('checklist', JSON.stringify(this.groups))
    }
  }
})
