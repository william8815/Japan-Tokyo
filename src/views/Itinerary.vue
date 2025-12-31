<script setup>
import { ref } from 'vue'
import { useItineraryStore } from '../stores/itinerary'
import { MapPin, Clock, Info, ChevronRight } from 'lucide-vue-next'

const itineraryStore = useItineraryStore()
const activeDay = ref(1)

const getTypeIcon = (type) => {
  // 根據類型返回對應樣式 (簡化版)
  switch (type) {
    case 'food': return 'bg-orange-100 text-orange-500'
    case 'transport': return 'bg-blue-100 text-blue-500'
    case 'hotel': return 'bg-purple-100 text-purple-500'
    case 'view': return 'bg-green-100 text-green-500'
    case 'shop': return 'bg-pink-100 text-pink-500'
    default: return 'bg-slate-100 text-slate-500'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <header>
      <h1 class="text-3xl font-bold text-slate-900">行程路線</h1>
      <p class="text-slate-500">5天4夜東京冬日之旅</p>
    </header>

    <!-- 天數切換 Tab -->
    <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      <button 
        v-for="day in itineraryStore.days" 
        :key="day.id"
        @click="activeDay = day.id"
        class="flex-shrink-0 px-6 py-3 rounded-2xl transition-all duration-300 font-medium"
        :class="activeDay === day.id 
          ? 'bg-ice-blue text-white shadow-lg shadow-blue-200 scale-105' 
          : 'bg-white text-slate-400 border border-slate-100'"
      >
        Day {{ day.id }}
      </button>
    </div>

    <!-- 當前行程清單 -->
    <div v-for="day in itineraryStore.days" :key="day.id">
      <div v-if="activeDay === day.id" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center space-x-2 mb-4">
          <span class="w-2 h-8 bg-ice-blue rounded-full"></span>
          <h2 class="text-xl font-semibold text-slate-800">{{ day.title }}</h2>
        </div>

        <div class="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          <div 
            v-for="(item, index) in day.items" 
            :key="index"
            class="relative glass p-4 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow"
          >
            <!-- 時間軸上的點 -->
            <div 
              class="absolute -left-[27px] top-6 w-4 h-4 rounded-full border-4 border-white shadow-sm"
              :class="activeDay === day.id ? 'bg-ice-blue' : 'bg-slate-300'"
            ></div>

            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <div class="flex items-center space-x-2 text-xs font-medium text-slate-400">
                  <Clock :size="12" />
                  <span>{{ item.time }}</span>
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider', getTypeIcon(item.type)]">
                    {{ item.type }}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-slate-800">{{ item.location }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
              </div>
              
              <button class="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-ice-blue transition-colors">
                <ChevronRight :size="20" />
              </button>
            </div>

            <!-- 底部動作 -->
            <div class="mt-4 pt-4 border-t border-slate-50 flex items-center space-x-4">
              <a href="#" class="flex items-center space-x-1 text-xs text-blue-500 font-medium">
                <MapPin :size="12" />
                <span>Google Maps</span>
              </a>
              <div class="flex items-center space-x-1 text-xs text-slate-400">
                <Info :size="12" />
                <span>詳細資料</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</style>
