import { defineStore } from 'pinia'

export const useChecklistStore = defineStore('checklist', {
  state: () => {
    const defaultGroups = [
      {
        id: 'luggage',
        name: '行李物資',
        items: [
          { id: 1, text: '護照與簽證 (VJW)', completed: false },
          { id: 2, text: '日幣現金', completed: false },
          { id: 3, text: '充電器與行動電源', completed: false },
          { id: 4, text: '換洗衣物與發熱衣', completed: false },
          { id: 5, text: '個人藥品', completed: false }
        ]
      },
      {
        id: 'tasks',
        name: '出發前待辦',
        items: [
          { id: 101, text: '預約 Skyliner 車票', completed: false },
          { id: 102, text: '購買旅遊保險', completed: false },
          { id: 103, text: '預下載 Google Maps 離線地圖', completed: false }
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
      localStorage.setItem('checklist', JSON.stringify({ groups: this.groups }))
    }
  }
})
