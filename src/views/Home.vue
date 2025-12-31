<script setup>
import { computed } from 'vue'
import { useItineraryStore } from '../stores/itinerary'
import { useWeather } from '../composables/useWeather'
import { Clock, MapPin, ChevronRight, Wind, Navigation } from 'lucide-vue-next'

const itineraryStore = useItineraryStore()
const { weather } = useWeather()

// 根據當前時間獲取正在進行或下一個行程
const currentStatus = computed(() => {
  const today = itineraryStore.days[0]
  if (!today) return { current: null, next: null }
  
  const now = new Date()
  const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  
  let current = null
  let next = null
  
  for (let i = 0; i < today.items.length; i++) {
    const item = today.items[i]
    if (item.time <= currentTimeStr) {
      current = item
    } else {
      next = item
      break
    }
  }
  
  return { current, next }
})

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return '早安，祝您今天旅日愉快'
  if (hour < 17) return '午安，目前行程進行中'
  return '晚安，今天辛苦了'
})
</script>

<template>
  <div class="space-y-8">
    <!-- 頂級動態天氣看板 -->
    <section class="relative group">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-[3.5rem] shadow-xl"></div>
      
      <!-- 裝飾性光輝 -->
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-white/20 blur-[100px] rounded-full animate-pulse "></div>
      
      <div class="relative p-10 text-white space-y-8 ">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-2 text-blue-100 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
              <MapPin :size="12" />
              <span>Tokyo, Japan</span>
            </div>
            <h1 class="text-6xl font-black tracking-tighter">{{ weather.temp }}°</h1>
            <p class="text-lg font-bold text-blue-100/80 mt-1">{{ weather.condition }}</p>
          </div>
          <div class="text-right">
            <span class="block text-4xl mb-1">❄️</span>
            <div class="flex items-center justify-end space-x-2 text-indigo-100/60 font-black text-[10px]">
              <Wind :size="12" />
              <span>{{ weather.snowChance }} 降雪率</span>
            </div>
          </div>
        </div>

        <!-- 問候語 -->
        <div class="pt-4 border-t border-white/10">
          <p class="text-sm font-bold text-blue-50/70">{{ timeGreeting }}</p>
          <p class="text-xs font-medium text-white/40 mt-1">今天日期：{{ new Date().toLocaleDateString('zh-TW', { weekday: 'long', month: 'long', day: 'numeric' }) }}</p>
        </div>
      </div>
    </section>

    <!-- 當前/下一個行程智慧卡片 -->
    <section class="space-y-4">
      <div class="flex justify-between items-center px-4">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">行程雷達 / NOW</h2>
        <RouterLink to="/itinerary" class="text-[10px] font-black text-ice-blue uppercase border-b border-ice-blue/30 pb-0.5">查看完整行程</RouterLink>
      </div>

      <RouterLink 
        v-if="currentStatus.current"
        :to="{ path: '/itinerary', query: { itemId: currentStatus.current.id } }"
        class="block glass p-8 rounded-[3rem] border border-white shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-ice-blue/5 blur-3xl -mr-10 -mt-10"></div>
        
        <div class="space-y-6 relative z-10">
          <div class="flex items-center space-x-4">
            <div class="w-2 h-10 bg-ice-blue rounded-full"></div>
            <div>
              <p class="text-[10px] font-black text-ice-blue uppercase tracking-widest mb-1">正在進行</p>
              <h3 class="text-2xl font-black text-slate-900 leading-tight">{{ currentStatus.current.location }}</h3>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-4 border-t border-slate-50">
            <div class="flex items-center space-x-3 text-slate-400">
              <Clock :size="16" />
              <span class="text-sm font-bold">預計停留至 {{ currentStatus.next ? currentStatus.next.time : '今日結束' }}</span>
            </div>
            <div class="bg-slate-900 text-white p-3 rounded-2xl shadow-xl shadow-slate-200">
              <Navigation :size="20" />
            </div>
          </div>
        </div>
      </RouterLink>
      <div v-else class="glass p-8 rounded-[3rem] border border-white shadow-sm text-center py-6">
        <p class="text-slate-400 font-bold text-sm">目前沒有正在進行的行程</p>
      </div>
    </section>


    <!-- 未來天氣快速滑動 -->
    <section class="space-y-4">
      <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest px-4">未來五（天）預選</h2>
      <div class="flex space-x-3 overflow-x-auto pb-6 px-1 scrollbar-hide">
        <div 
          v-for="day in weather.forecast" 
          :key="day.day"
          class="flex-shrink-0 w-28 glass p-5 rounded-[3rem] border border-white flex flex-col items-center space-y-2 shadow-sm"
        >
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{{ day.day }}</span>
          <span class="text-2xl">{{ day.condition === 'Snow' || day.condition === 'CloudSnow' ? '❄️' : day.condition === 'Rain' ? '🌧️' : day.condition === 'Cloudy' ? '☁️' : '☀️' }}</span>
          <span class="text-lg font-black text-slate-800">{{ day.temp }}°</span>
          <span class="text-[10px] font-bold text-slate-400">{{ day.condition === 'Snow' || day.condition === 'CloudSnow' ? '下雪' : day.condition === 'Rain' ? '下雨' : day.condition === 'Cloudy' ? '多雲' : '晴天' }}</span>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
</style>
