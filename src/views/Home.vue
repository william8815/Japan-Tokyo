<script setup>
import { useWeather } from '../composables/useWeather'
import { CloudSnow, Thermometer, Wind, Droplets, MapPin, Calendar, ArrowRight } from 'lucide-vue-next'
import { useItineraryStore } from '../stores/itinerary'

const { weather } = useWeather()
const itineraryStore = useItineraryStore()

// 獲取今日第一項行程作為示例
const todayItinerary = itineraryStore.days[0]
const nextStop = todayItinerary.items[0]
</script>

<template>
  <div class="space-y-8 pb-10">
    <!-- 頂部天氣看板 -->
    <section class="relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 min-h-[320px] flex flex-col justify-between">
      <!-- 背景漸層與點綴 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 -z-10"></div>
      <div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-blue-300/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full w-fit mb-4">
            <MapPin :size="14" />
            <span class="text-xs font-semibold uppercase tracking-wider">Tokyo, Japan</span>
          </div>
          <h2 class="text-5xl font-bold tracking-tighter">{{ weather.temp }}°</h2>
          <p class="text-xl font-medium text-white/90">下雪中 (Snowing)</p>
        </div>
        <CloudSnow :size="80" class="text-white drop-shadow-lg animate-bounce duration-[3000ms]" />
      </div>

      <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 mt-6">
        <div class="text-center">
          <p class="text-white/60 text-[10px] uppercase font-bold mb-1">降雪機率</p>
          <div class="flex items-center justify-center space-x-1">
            <Droplets :size="14" />
            <span class="text-sm font-bold">{{ weather.snowChance }}</span>
          </div>
        </div>
        <div class="text-center">
          <p class="text-white/60 text-[10px] uppercase font-bold mb-1">風速</p>
          <div class="flex items-center justify-center space-x-1">
            <Wind :size="14" />
            <span class="text-sm font-bold">12 km/h</span>
          </div>
        </div>
        <div class="text-center">
          <p class="text-white/60 text-[10px] uppercase font-bold mb-1">體感</p>
          <div class="flex items-center justify-center space-x-1">
            <Thermometer :size="14" />
            <span class="text-sm font-bold">-2°</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 行程概要 -->
    <section class="space-y-4">
      <div class="flex justify-between items-end px-2">
        <h3 class="text-xl font-bold text-slate-800 tracking-tight">今日下一站</h3>
        <RouterLink to="/itinerary" class="text-sm font-semibold text-ice-blue flex items-center">
          全部行程 <ArrowRight :size="16" class="ml-1" />
        </RouterLink>
      </div>

      <div class="glass p-6 rounded-[2rem] space-y-4 border border-white shadow-sm ring-1 ring-slate-100/50">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center space-x-2 text-ice-blue font-bold text-sm">
              <Calendar :size="16" />
              <span>Day 1 · {{ nextStop.time }}</span>
            </div>
            <h4 class="text-2xl font-black text-slate-900 tracking-tight">{{ nextStop.location }}</h4>
            <p class="text-slate-500 font-medium leading-snug">{{ nextStop.desc }}</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <MapPin :size="24" />
          </div>
        </div>
      </div>
    </section>

    <!-- 未來 5 天天氣小卡 -->
    <section class="space-y-4">
      <h3 class="text-xl font-bold text-slate-800 tracking-tight px-2">未來預報</h3>
      <div class="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        <div 
          v-for="f in weather.forecast" 
          :key="f.day"
          class="flex-shrink-0 w-24 glass py-5 rounded-3xl text-center border border-white shadow-sm ring-1 ring-slate-100/30"
        >
          <p class="text-xs font-bold text-slate-400 mb-3">{{ f.day }}</p>
          <CloudSnow v-if="f.condition.includes('Snow')" :size="24" class="mx-auto text-blue-400 mb-3" />
          <p class="text-lg font-black text-slate-800">{{ f.temp }}°</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce {
  animation: bounce 3s ease-in-out infinite;
}
</style>
