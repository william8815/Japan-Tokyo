<script setup>
import { ref, computed } from 'vue'
import { useWeather } from '../composables/useWeather'
import { 
  ArrowLeft, Sun, Cloud, CloudRain, CloudSnow, 
  Cloudy, Zap, Wind, Droplets, Thermometer, RefreshCw 
} from 'lucide-vue-next'
import { TRIP_CONFIG } from '../config/tripConfig'
import { useRouter } from 'vue-router'

const router = useRouter()
const { weather, isLoading, error, fetchWeather } = useWeather()
const activeDateIndex = ref(0)

const activeDayForecast = computed(() => {
  if (!weather.value.byDate || weather.value.byDate.length === 0) return null
  return weather.value.byDate[activeDateIndex.value]
})

const getIcon = (name) => {
  switch (name) {
    case 'Sun': return Sun
    case 'Cloudy': return Cloudy
    case 'CloudRain': return CloudRain
    case 'CloudSnow': return CloudSnow
    case 'Zap': return Zap
    default: return Cloud
  }
}

const handleRefresh = () => {
  fetchWeather(true)
}
</script>

<template>
  <div class="space-y-6 pb-20">
    <!-- 頂部與返回 -->
    <div class="flex items-center justify-between px-2">
      <button @click="router.back()" class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="text-lg font-black text-slate-800 tracking-tight">{{ TRIP_CONFIG.info.location.name }} 氣象詳情</h1>
      <button 
        @click="handleRefresh" 
        class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-ice-blue active:rotate-180 transition-all duration-500"
        :class="{ 'animate-spin': isLoading }"
      >
        <RefreshCw :size="20" />
      </button>
    </div>

    <!-- 骨架屏 (Skeleton) -->
    <div v-if="isLoading && !weather.byDate.length" class="space-y-6 animate-pulse px-2">
      <div class="h-16 bg-slate-200 rounded-[2rem]"></div>
      <div v-for="i in 5" :key="i" class="h-24 bg-slate-100 rounded-[2rem]"></div>
    </div>

    <!-- 錯誤處理 -->
    <div v-else-if="error" class="bg-red-50 p-8 rounded-[3rem] text-center space-y-4 mx-2 border border-red-100">
      <div class="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-red-500">
        <Wind :size="24" />
      </div>
      <p class="text-sm font-bold text-red-800">{{ error }}</p>
      <button @click="handleRefresh" class="text-xs font-black text-red-500 uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm">重試串接</button>
    </div>

    <template v-else>
      <!-- 日期選擇 Tabs -->
      <div class="sticky top-0 z-40 pt-4 pb-4 -mx-4 px-6 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm mb-4 scrollbar-hide flex space-x-2 overflow-x-auto">
        <button 
          v-for="(day, index) in weather.byDate" 
          :key="day.date"
          @click="activeDateIndex = index"
          class="flex-shrink-0 px-6 py-4 rounded-[2rem] transition-all duration-300 flex flex-col items-center space-y-1 border"
          :class="activeDateIndex === index 
            ? 'bg-ice-blue text-white border-ice-blue shadow-lg shadow-ice-blue/20 scale-105' 
            : 'bg-white text-slate-400 border-slate-100 shadow-sm'"
        >
          <span class="text-[10px] font-black uppercase tracking-tighter opacity-70">{{ day.weekday }}</span>
          <span class="text-sm font-black">{{ day.date }}</span>
        </button>
      </div>

      <!-- 3 小時詳情時間軸 -->
      <div v-if="activeDayForecast" class="space-y-3 px-2">
        <div 
          v-for="hour in activeDayForecast.hours" 
          :key="hour.time"
          class="glass p-5 rounded-[2.5rem] border border-white flex items-center justify-between shadow-sm group active:scale-[0.98] transition-all"
        >
          <div class="flex items-center space-x-5">
            <div class="text-center w-12">
              <span class="text-xs font-black text-slate-800 tracking-tighter">{{ hour.time }}</span>
            </div>
            
            <div class="h-8 w-[1px] bg-slate-100"></div>
            
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-ice-blue/10 transition-colors">
                <component :is="getIcon(hour.icon)" :size="20" :class="activeDateIndex === 0 ? 'text-ice-blue' : 'text-slate-500'" />
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{{ hour.desc }}</p>
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-black text-slate-800">{{ hour.temp }}°</span>
                  <div class="flex items-center space-x-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Droplets :size="8" />
                    <span>{{ hour.pop }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <ChevronRight :size="16" class="text-slate-200" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
}
</style>
