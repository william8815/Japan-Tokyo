<script setup>
import { ref, computed } from 'vue'
import { useItineraryStore } from '../stores/itinerary'
import { useWeather } from '../composables/useWeather'
import { useExpenseStore } from '../stores/expense'
import { useChecklistStore } from '../stores/checklist'
import { TRIP_CONFIG } from '../config/tripConfig'
import { 
  Clock, MapPin, ChevronRight, Wind, Navigation, 
  RefreshCw, Wallet, CheckSquare, AlertCircle, CheckCircle 
} from 'lucide-vue-next'

const itineraryStore = useItineraryStore()
const expenseStore = useExpenseStore()
const checklistStore = useChecklistStore()
const { weather, isLoading, error, fetchWeather } = useWeather()

// 1. 智慧行程雷達邏輯
const currentStatus = computed(() => {
  // 使用當地時間 YYYY-MM-DD 格式
  const todayStr = new Date().toLocaleDateString('en-CA')
  const today = itineraryStore.days.find(d => d.date === todayStr)
  
  if (!today) return { current: null, next: null, status: 'idle' }
  
  const now = new Date()
  const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  
  // 找出第一個尚未完成 (未採點) 的行程
  // 這會自動處理「採點後跳下一個」的需求
  const pendingIndex = today.items.findIndex(item => !item.actualArrival)
  
  // 如果所有行程都完成了
  if (pendingIndex === -1) return { current: null, next: null, status: 'completed' }
  
  const target = today.items[pendingIndex]
  const nextTarget = today.items[pendingIndex + 1] || null
  
  // 判斷狀態：如果現在時間已經超過該行程的預定時間，視為「正在進行 (Delay也算)」
  // 如果還沒到預定時間，視為「即將開始」
  if (currentTimeStr >= target.time) {
    return { current: target, next: nextTarget, status: 'ongoing' }
  } else {
    // 時間還沒到，顯示為 Next (Upcoming)
    // 修正：必須將 target 放入 current 欄位，Template 才會渲染卡片
    return { current: target, next: null, status: 'upcoming' }
  }
})

// 2. 今日摘要數據整合
const todaySummary = computed(() => {
  const todayStr = new Date().toLocaleDateString('en-CA')
  const todayExpenses = expenseStore.expenses.filter(e => e.date === todayStr)
  const spentToday = todayExpenses.reduce((sum, e) => sum + (e.currency === 'JPY' ? e.amount : e.amount / expenseStore.customRate), 0)
  
  // 取得急迫待辦 (前兩項未完成的任務)
  const urgentTasks = checklistStore.groups
    .flatMap(g => g.items)
    .filter(i => !i.completed)
    .slice(0, 2)
    
  return {
    spent: Math.round(spentToday),
    spentTWD: Math.round(spentToday * expenseStore.customRate),
    budgetProgress: Math.min(Math.round((expenseStore.totalSpent / expenseStore.budget) * 100), 100),
    urgentTasks
  }
})

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 5) return '夜深了，請注意休息'
  if (hour < 11) return '早安，祝您今天旅日愉快'
  if (hour < 17) return '午安，目前行程進行中'
  return '晚安，今天辛苦了'
})

const handleRefresh = () => {
  fetchWeather(true) // 強制刷新
}
</script>

<template>
  <div class="space-y-8">
    <!-- 頂級動態天氣看板 (V3) - 點擊進入詳情 -->
    <RouterLink to="/weather" class="block relative group active:scale-[0.98] transition-all duration-300">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-400 to-indigo-500 rounded-[3.5rem] shadow-xl shadow-blue-100"></div>
      
      <!-- 裝飾性光輝 -->
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-white/20 blur-[80px] rounded-full animate-pulse "></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-300/10 blur-[80px] rounded-full "></div>
      
      <div class="relative p-8 text-white space-y-6">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <div class="flex items-center space-x-2 text-blue-50/70 font-black uppercase tracking-[0.2em] text-[10px]">
              <MapPin :size="10" />
              <span>{{ TRIP_CONFIG.info.location.name }}</span>
            </div>
            
            <div v-if="isLoading && !weather.lastUpdated" class="animate-pulse py-2">
              <div class="h-12 w-20 bg-white/20 rounded-xl mb-2"></div>
              <div class="h-4 w-28 bg-white/10 rounded-lg"></div>
            </div>
            <div v-else-if="error" class="py-2">
              <div class="flex items-center space-x-2 text-red-100/80">
                <AlertCircle :size="16" />
                <span class="text-xs font-black">連接失敗</span>
              </div>
              <p class="text-[9px] opacity-60 mt-1 max-w-[150px]">{{ error }}</p>
            </div>
            <div v-else>
              <h1 class="text-6xl font-black tracking-tighter">{{ weather.temp }}°</h1>
              <div class="flex items-center space-x-2 mt-1">
                <p class="text-sm font-bold text-blue-50/80">{{ weather.condition }}</p>
                <ChevronRight :size="14" class="opacity-50" />
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-end space-y-4">
            <button 
              @click.prevent="handleRefresh" 
              class="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:rotate-180 duration-500 z-20"
              :class="{ 'animate-spin': isLoading }"
              title="重新整理天氣"
            >
              <RefreshCw :size="16" />
            </button>
            <div class="text-right">
              <span class="block text-4xl mb-1">{{ weather.icon === 'CloudSnow' || weather.icon === 'Snow' ? '❄️' : '☀️' }}</span>
              <div class="flex items-center justify-end space-x-1.5 text-blue-50/60 font-black text-[9px]">
                <Wind :size="10" />
                <span>{{ weather.snowChance }} 降水率</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 問候與最後更新時間 -->
        <div class="pt-4 border-t border-white/10 flex justify-between items-end">
          <div>
            <p class="text-xs font-bold text-blue-50/80">{{ timeGreeting }}</p>
            <p class="text-[9px] text-white/40 mt-1 uppercase tracking-widest">{{ new Date().toLocaleDateString('zh-TW', { weekday: 'long', month: 'long', day: 'numeric' }) }}</p>
          </div>
          <div v-if="weather.lastUpdated" class="text-[8px] text-white/30 font-bold uppercase tracking-tighter">
            Updated: {{ weather.lastUpdated }}
          </div>
        </div>
      </div>
    </RouterLink>

    <!-- 行程雷達 (Restored & Enhanced) -->
    <section class="space-y-4">
      <div class="flex justify-between items-center px-4">
        <div class="flex items-center space-x-2">
          <div class="w-1 h-3 bg-ice-blue rounded-full"></div>
          <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">行程雷達 / {{ currentStatus.status === 'upcoming' ? 'NEXT' : 'NOW' }}</h2>
        </div>
        <RouterLink to="/itinerary" class="text-[9px] font-black text-ice-blue uppercase tracking-tighter flex items-center">
          查看全部 <ChevronRight :size="10" />
        </RouterLink>
      </div>

      <RouterLink 
        v-if="currentStatus.current"
        :to="{ path: '/itinerary', query: { itemId: currentStatus.current.id } }"
        class="block glass p-6 rounded-[2.5rem] border border-white shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all"
      >
        <div class="absolute top-0 right-0 w-24 h-24 blur-3xl -mr-10 -mt-10" :class="currentStatus.status === 'upcoming' ? 'bg-orange-400/10' : 'bg-ice-blue/5'"></div>
        
        <div class="flex justify-between items-center relative z-10">
          <div class="space-y-3">
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest mb-1 flex items-center space-x-1" :class="currentStatus.status === 'upcoming' ? 'text-orange-500/60' : 'text-ice-blue/60'">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="currentStatus.status === 'upcoming' ? 'bg-orange-500' : 'bg-ice-blue'"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2" :class="currentStatus.status === 'upcoming' ? 'bg-orange-500' : 'bg-ice-blue'"></span>
                </span>
                <span>{{ currentStatus.status === 'upcoming' ? '即將開始' : '正在進行' }}</span>
              </p>
              <h3 class="text-xl font-black text-slate-800 leading-tight">{{ currentStatus.current.location }}</h3>
            </div>
            
            <div class="flex items-center space-x-4 text-[10px] font-bold text-slate-400">
              <div class="flex items-center space-x-1">
                <Clock :size="12" />
                <span>{{ currentStatus.current.time }}</span>
              </div>
              <div v-if="currentStatus.next" class="flex items-center space-x-1">
                <span class="opacity-30">→</span>
                <span>{{ currentStatus.next.location }}</span>
              </div>
            </div>
          </div>
          <div class="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl shadow-slate-200 group-hover:bg-ice-blue transition-colors">
            <Navigation :size="18" />
          </div>
        </div>
      </RouterLink>
      <div v-else class="glass p-8 rounded-[2.5rem] border border-white shadow-sm text-center py-8">
        <p class="text-slate-300 font-bold text-sm">目前沒有正在進行的行程</p>
      </div>
    </section>

    <!-- 今日摘要儀表板 (Dashboard) -->
    <section class="grid grid-cols-2 gap-4 px-1 pb-4">
      <!-- 財務看板 -->
      <RouterLink to="/expense" class="glass p-5 rounded-[2.5rem] border border-white shadow-sm space-y-4 active:scale-[0.97] transition-all">
        <div class="flex justify-between items-start">
          <div class="p-2 bg-orange-50 text-orange-500 rounded-xl">
            <Wallet :size="16" />
          </div>
          <span class="text-[8px] font-black text-slate-300 uppercase">Expense</span>
        </div>
        <div>
          <h4 class="text-[10px] font-bold text-slate-400">今日支出</h4>
          <p class="text-lg font-black text-slate-800 leading-none mt-1">¥{{ todaySummary.spent.toLocaleString() }}</p>
          <p class="text-[9px] font-bold text-slate-400 mt-1">≈ ${{ todaySummary.spentTWD.toLocaleString() }}</p>
        </div>
        <!-- 預算進度條 -->
        <div class="space-y-1.5">
          <div class="flex justify-between text-[8px] font-black uppercase text-slate-400">
            <span>Budget</span>
            <span>{{ todaySummary.budgetProgress }}%</span>
          </div>
          <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-orange-400 rounded-full" :style="{ width: todaySummary.budgetProgress + '%' }"></div>
          </div>
        </div>
      </RouterLink>

      <!-- 清單縮影 -->
      <RouterLink to="/checklist" class="glass p-5 rounded-[2.5rem] border border-white shadow-sm space-y-4 active:scale-[0.97] transition-all">
        <div class="flex justify-between items-start">
          <div class="p-2 bg-blue-50 text-blue-500 rounded-xl">
            <CheckSquare :size="16" />
          </div>
          <span class="text-[8px] font-black text-slate-300 uppercase">Checklist</span>
        </div>
        <div class="space-y-2">
          <h4 class="text-[10px] font-bold text-slate-400">行前準備</h4>
          <div v-if="todaySummary.urgentTasks.length > 0" class="space-y-2">
            <div v-for="task in todaySummary.urgentTasks" :key="task.id" class="flex items-center space-x-2">
              <div class="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span class="text-[10px] font-bold text-slate-600 truncate">{{ task.text }}</span>
            </div>
          </div>
          <div v-else class="flex items-center space-x-2 text-green-500">
            <CheckCircle :size="12" />
            <span class="text-[10px] font-bold">已經準備好了</span>
          </div>
        </div>
        <div class="pt-2">
          <span class="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
            {{ checklistStore.totalProgress }}% Done
          </span>
        </div>
      </RouterLink>
    </section>
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
