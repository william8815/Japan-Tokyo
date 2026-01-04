import { defineStore } from 'pinia'
import { TRIP_CONFIG } from '../config/tripConfig'

/**
 * 行程狀態管理 (Itinerary Store)
 * 負責管理旅程中的打卡狀態與天數呈現
 * 資料來源：src/config/tripConfig.js
 */
export const useItineraryStore = defineStore('itinerary', {
  state: () => {
    const startDate = new Date(TRIP_CONFIG.info.startDate)
    
    // 初始化行程資料並套用動態日期
    const saved = localStorage.getItem('itinerary')
    let dayList = saved ? JSON.parse(saved).days : TRIP_CONFIG.itinerary
    const days = dayList.map((day, dayIndex) => {
      const currentDayDate = new Date(startDate)
      currentDayDate.setDate(startDate.getDate() + dayIndex)
      const dateStr = currentDayDate.toISOString().split('T')[0]
      
      return {
        ...day,
        date: dateStr,
        items: day.items.map(item => ({
          ...item,
          actualArrival: null,
          actualDeparture: null
        }))
      }
    })

    // 從 localStorage 讀取已儲存的採點狀態
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        // 合併採點狀態到新生成的資料
        savedData.days?.forEach((savedDay, dayIdx) => {
          savedDay.items?.forEach((savedItem, itemIdx) => {
            if (days[dayIdx]?.items[itemIdx]) {
              days[dayIdx].items[itemIdx].actualArrival = savedItem.actualArrival
              days[dayIdx].items[itemIdx].actualDeparture = savedItem.actualDeparture
            }
          })
        })
      } catch (e) {
        console.error('Failed to load itinerary from localStorage:', e)
      }
    }

    return { days }
  },
  
  actions: {
    /**
     * 更新行程項目的打卡狀態（使用當前時間）
     * @param {number} itemId 
     * @param {'arrival' | 'departure'} type 
     */
    checkIn(itemId, type = 'arrival') {
      const now = new Date()
      const currentTime = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      })

      this.days.forEach(day => {
        const item = day.items.find(i => i.id === itemId)
        if (item) {
          if (type === 'arrival') item.actualArrival = currentTime
          else item.actualDeparture = currentTime
        }
      })
      
      this.saveToLocalStorage()
    },

    /**
     * 手動更新打卡時間
     * @param {number} itemId 
     * @param {string} time - HH:MM 格式
     * @param {'arrival' | 'departure'} type 
     */
    updateCheckInTime(itemId, time, type = 'arrival') {
      this.days.forEach(day => {
        const item = day.items.find(i => i.id === itemId)
        if (item) {
          if (type === 'arrival') item.actualArrival = time
          else item.actualDeparture = time
        }
      })
      
      this.saveToLocalStorage()
    },

    /**
     * 新增行程項目
     * @param {number} dayId 
     * @param {object} item 
     */
    addItem(dayId, item) {
      const day = this.days.find(d => d.id === dayId)
      if (day) {
        const newItem = {
          id: Date.now(),
          actualArrival: null,
          actualDeparture: null,
          details: {},
          ...item
        }
        day.items.push(newItem)
        // 按時間排序
        day.items.sort((a, b) => a.time.localeCompare(b.time))
        this.saveToLocalStorage()
      }
    },

    /**
     * 更新行程項目
     * @param {number} itemId 
     * @param {object} updates 
     */
    updateItem(itemId, updates) {
      this.days.forEach(day => {
        const item = day.items.find(i => i.id === itemId)
        if (item) {
          Object.assign(item, updates)
          // 按時間排序
          day.items.sort((a, b) => a.time.localeCompare(b.time))
        }
      })
      
      this.saveToLocalStorage()
    },

    /**
     * 刪除行程項目
     * @param {number} itemId 
     */
    deleteItem(itemId) {
      this.days.forEach(day => {
        const index = day.items.findIndex(i => i.id === itemId)
        if (index !== -1) {
          day.items.splice(index, 1)
        }
      })
      
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      localStorage.setItem('itinerary', JSON.stringify({ days: this.days }))
    }
  }
})
