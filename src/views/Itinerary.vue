<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useItineraryStore } from '../stores/itinerary'
import { MapPin, Clock, Info, ChevronRight, Train, Utensils, Camera, CheckCircle2, Navigation } from 'lucide-vue-next'

const route = useRoute()
const itineraryStore = useItineraryStore()
const activeDay = ref(1)

// 時間計算工具
const calculateDiff = (planned, actual) => {
  if (!actual) return null
  const [ph, pm] = planned.split(':').map(Number)
  const [ah, am] = actual.split(':').map(Number)
  const diffMinutes = (ah * 60 + am) - (ph * 60 + pm)
  
  if (diffMinutes === 0) return '準點'
  
  const absDiff = Math.abs(diffMinutes)
  const h = Math.floor(absDiff / 60)
  const m = absDiff % 60
  const timeStr = h > 0 ? `${h}時${m}分` : `${m}分`
  
  return diffMinutes > 0 ? `晚 ${timeStr}` : `早 ${timeStr}`
}

const calculateStay = (prevActual, currActual) => {
  if (!prevActual || !currActual) return null
  const [ph, pm] = prevActual.split(':').map(Number)
  const [ch, cm] = currActual.split(':').map(Number)
  const diff = (ch * 60 + cm) - (ph * 60 + pm)
  if (diff <= 0) return null
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return h > 0 ? `${h}時${m}分` : `${m}分`
}

onMounted(() => {
  if (route.query.itemId) {
    const itemId = Number(route.query.itemId)
    itineraryStore.days.forEach(day => {
      const found = day.items.find(i => i.id === itemId)
      if (found) {
        activeDay.value = day.id
        // 跳轉到對應項目位置
        nextTick(() => {
          const el = document.getElementById(`item-${itemId}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      }
    })
  }
})

const getTypeConfig = (type) => {
  switch (type) {
    case 'transport': return { icon: Train, color: 'text-blue-500 bg-blue-50', label: '交通移動' }
    case 'food': return { icon: Utensils, color: 'text-orange-500 bg-orange-50', label: '美食餐廳' }
    case 'attraction': return { icon: Camera, color: 'text-pink-500 bg-pink-50', label: '熱門景點' }
    default: return { icon: Info, color: 'text-slate-500 bg-soft-blue/20', label: '其他活動' }
  }
}

const handleCheckIn = (id) => {
  itineraryStore.checkIn(id, 'arrival')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <header class="px-2">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">行程排程</h1>
      <p class="text-slate-500 font-medium">1/7 - 1/11 真實旅程追蹤</p>
    </header>

    <!-- 天數切換 Tab -->
    <div class="tab-list flex gap-3 overflow-x-auto scrollbar-hide p-2 items-center">
      <button 
        v-for="day in itineraryStore.days" 
        :key="day.id"
        @click="activeDay = day.id"
        class="flex-shrink-0 px-6 py-4 rounded-[2rem] transition-all duration-300 font-bold text-sm transform-origin-center"
        :class="activeDay === day.id 
          ? 'bg-ice-blue text-white shadow-md scale-105' 
          : 'bg-white text-slate-400 border border-slate-100 scale-100'"
      >
        {{ day.id === 1 ? '1/7' : day.id === 2 ? '1/8' : day.id === 3 ? '1/9' : day.id === 4 ? '1/10' : '1/11' }}
        <span class="block text-[8px] opacity-70 uppercase mt-1">Day {{ day.id }}</span>
      </button>
    </div>

    <!-- 當前行程清單 -->
    <div v-for="day in itineraryStore.days" :key="day.id">
      <div v-if="activeDay === day.id" class="space-y-0 px-1 animate-in fade-in duration-500">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pl-2">{{ day.title }}</h2>

        <div class="relative pl-4 space-y-0 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
          <div 
            v-for="(item, index) in day.items" 
            :key="item.id"
            class="relative pb-10"
          >
            <!-- 停留時間顯示 (顯示在目前景點的上方，前提是下一個景點也採點了) -->
            <div v-if="index < day.items.length - 1 && item.actualArrival && day.items[index+1].actualArrival" class="absolute left-6 -top-3 z-20">
              <div class="bg-ice-blue text-[9px] text-white px-3 py-1 rounded-full font-black flex items-center space-x-1 shadow-lg shadow-blue-100 ring-2 ring-white">
                <Clock :size="8" />
                <span>在此處停留 {{ calculateStay(item.actualArrival, day.items[index+1].actualArrival) }}</span>
              </div>
            </div>

            <!-- 時間軸上的點 -->
            <div 
              class="absolute -left-[14px] top-6 w-5 h-5 rounded-full border-[6px] border-white shadow-sm z-10 transition-colors duration-500"
              :class="item.actualArrival ? 'bg-ice-blue' : 'bg-slate-200'"
            ></div>

            <div 
              :id="`item-${item.id}`"
              class="relative glass p-5 rounded-[2.5rem] border transition-all active:scale-[0.99] shadow-sm"
              :class="item.actualArrival ? 'bg-ice-blue/[0.03] border-ice-blue/10 scale-[0.98]' : 'bg-white border-white'"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center space-x-3">
                  <div :class="['p-3 rounded-2xl transition-all', item.actualArrival ? 'scale-90 opacity-80' : '', getTypeConfig(item.type).color]">
                    <component :is="getTypeConfig(item.type).icon" :size="20" />
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-slate-800 leading-tight">{{ item.location }}</h3>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">預計 {{ item.time }}</span>
                      
                      <!-- 抵達時間偏差顯示 -->
                      <template v-if="item.actualArrival">
                        <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
                        <span class="text-[10px] font-black" :class="calculateDiff(item.time, item.actualArrival).includes('晚') ? 'text-red-500' : 'text-green-500'">
                          {{ calculateDiff(item.time, item.actualArrival) }}
                        </span>
                      </template>
                    </div>
                  </div>
                </div>
                
                <!-- 採點按鈕 -->
                <button 
                  v-if="!item.actualArrival"
                  @click="handleCheckIn(item.id)"
                  class="bg-ice-blue text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                  採點
                </button>
                <div v-else class="text-right">
                  <p class="text-[10px] font-black text-ice-blue uppercase tracking-widest opacity-60">已採點</p>
                  <p class="text-sm font-black text-slate-900">{{ item.actualArrival }}</p>
                </div>
              </div>

              <p class="text-sm text-slate-500 font-medium leading-normal pl-2 border-l-2 border-slate-50">{{ item.desc }}</p>

              <!-- 詳細標籤 -->
              <div v-if="item.details?.mustTry || item.details?.note" class="mt-4 flex flex-wrap gap-2 pl-2">
                <span v-for="tag in item.details.mustTry" :key="tag" class="bg-ice-blue/5 px-2 py-1 rounded-lg text-[9px] font-bold text-ice-blue border border-ice-blue/10">✨ {{ tag }}</span>
                <span v-if="item.details.note" class="bg-slate-50 px-2 py-1 rounded-lg text-[9px] font-bold text-slate-400">📝 {{ item.details.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-list {
  scroll-behavior: smooth;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
</style>
