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
    const days = TRIP_CONFIG.itinerary.map((day, dayIndex) => {
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
    const saved = localStorage.getItem('itinerary')
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
     * 更新行程項目的採點狀態
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
    
    saveToLocalStorage() {
      localStorage.setItem('itinerary', JSON.stringify({ days: this.days }))
    }
  }
})
