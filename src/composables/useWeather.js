import { ref, onMounted } from 'vue'
import { TRIP_CONFIG } from '../config/tripConfig'

/**
 * 前端工程師專業實作：天氣資料 Composables
 * 支援 OpenWeatherMap API 串接與資料清洗 (Data Mapping)
 */
export function useWeather() {
  const weather = ref({
    temp: '--',
    condition: '載入中...',
    icon: 'Cloud',
    forecast: [],       // 用於簡要顯示 (原本的 12:00 預報)
    byDate: [],         // 用於詳細分頁 (依日期分組的 3 小時預報)
    snowChance: '--',
    lastUpdated: null
  })
  
  const isLoading = ref(true)
  const error = ref(null)

  // 從環境變數讀取 API Key，從配置檔讀取座標
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  const { lat: LAT, lon: LON } = TRIP_CONFIG.info.location
  const CACHE_KEY = 'tokyo_weather_cache' // 更新快取版本
  const CACHE_TTL = 3 * 60 * 60 * 1000 // 3 小時快取

  const weatherMap = {
    'Clear': { label: '晴朗', icon: 'Sun' },
    'Clouds': { label: '多雲', icon: 'Cloudy' },
    'Rain': { label: '下雨', icon: 'CloudRain' },
    'Snow': { label: '下雪', icon: 'CloudSnow' },
    'Drizzle': { label: '毛毛雨', icon: 'CloudDrizzle' },
    'Thunderstorm': { label: '雷雨', icon: 'Zap' },
    'Mist': { label: '薄霧', icon: 'Cloudy' },
    'Haze': { label: '霾', icon: 'Cloudy' },
    'Fog': { label: '濃霧', icon: 'Cloudy' }
  }

  const fetchWeather = async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_TTL) {
          weather.value = data
          isLoading.value = false
          return
        }
      }
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      isLoading.value = false
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}&lang=zh_tw`
      )
      if (!response.ok) throw new Error('無法串接天氣資料')
      const data = await response.json()

      // 1. 整理全量資料 (By Date)
      const grouped = {}
      data.list.forEach(item => {
        const dateObj = new Date(item.dt * 1000)
        const dateKey = dateObj.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }).replace('月', '/').replace('日', '')
        const weekday = dateObj.toLocaleDateString('zh-TW', { weekday: 'short' })
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = { date: dateKey, weekday, hours: [] }
        }
        
        const conditionKey = item.weather[0].main
        grouped[dateKey].hours.push({
          time: dateObj.toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: false }),
          temp: Math.round(item.main.temp),
          icon: weatherMap[conditionKey]?.icon || 'Cloud',
          desc: weatherMap[conditionKey]?.label || item.weather[0].description,
          pop: Math.round(item.pop * 100) // 降雨機率
        })
      })

      // 2. 轉換為 Array 並篩選精簡預報 (12:00)
      const byDateArray = Object.values(grouped)
      const dailyForecast = data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5)
        .map(item => {
          const fcCondition = item.weather[0].main
          return {
            day: new Date(item.dt * 1000).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }).replace('月', '/').replace('日', ''),
            temp: Math.round(item.main.temp),
            condition: weatherMap[fcCondition]?.icon || 'Cloud',
            desc: weatherMap[fcCondition]?.label || item.weather[0].description
          }
        })

      // 3. 更新狀態
      const current = data.list[0]
      const currentMapped = weatherMap[current.weather[0].main] || { label: current.weather[0].description, icon: 'Cloud' }
      
      const weatherData = {
        temp: Math.round(current.main.temp),
        condition: currentMapped.label,
        icon: currentMapped.icon,
        forecast: dailyForecast,
        byDate: byDateArray,
        snowChance: `${Math.round(current.pop * 100)}%`,
        lastUpdated: new Date().toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit' })
      }

      weather.value = weatherData
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: weatherData, timestamp: Date.now() }))

    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => fetchWeather(false))
  return { weather, isLoading, error, fetchWeather }
}



