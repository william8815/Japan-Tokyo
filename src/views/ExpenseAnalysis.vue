<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenseStore, categoryConfig } from '../stores/expense'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { ChevronLeft, ArrowDownWideNarrow } from 'lucide-vue-next'

ChartJS.register(ArcElement, Tooltip, Legend)

const router = useRouter()
const expenseStore = useExpenseStore()

// Data Processing
const categoryStats = computed(() => {
  const stats = {}
  expenseStore.expenses.forEach(e => {
    if (!stats[e.category]) {
      stats[e.category] = { name: e.category, amount: 0, count: 0 }
    }
    stats[e.category].amount += e.amount
    stats[e.category].count += 1
  })

  const total = Object.values(stats).reduce((sum, item) => sum + item.amount, 0)

  return Object.values(stats)
    .map(item => ({
      ...item,
      percentage: total ? Math.round((item.amount / total) * 100) : 0,
      config: categoryConfig[item.name] || categoryConfig['其他']
    }))
    .sort((a, b) => b.amount - a.amount)
})

// Chart Data
const chartData = computed(() => {
  return {
    labels: categoryStats.value.map(s => s.name),
    datasets: [
      {
        backgroundColor: categoryStats.value.map(s => s.config.color),
        borderWidth: 0,
        data: categoryStats.value.map(s => s.amount)
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw || 0
          return ` ¥${value.toLocaleString()}`
        }
      }
    }
  },
  cutout: '75%'
}
</script>

<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <header class="flex items-center px-2 py-2">
      <button @click="router.back()" class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all">
          <ChevronLeft :size="20" />
      </button>
      <h1 class="text-xl font-black text-slate-900 tracking-tight ml-2">消費分析</h1>
    </header>

    <!-- Chart Section -->
    <section class="relative aspect-square max-h-[300px] mx-auto">
      <Doughnut :data="chartData" :options="chartOptions" />
      
      <!-- Center Text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">總支出</p>
        <div class="flex items-baseline space-x-1">
          <span class="text-xs font-bold text-slate-400">¥</span>
          <h2 class="text-3xl font-black text-slate-900 tracking-tighter">{{ expenseStore.totalSpent.toLocaleString() }}</h2>
        </div>
      </div>
    </section>

    <!-- Ranking List -->
    <section class="space-y-4 px-2">
      <div class="flex items-center space-x-2 text-slate-300 mb-2">
        <ArrowDownWideNarrow :size="14" />
        <span class="text-[10px] font-black uppercase tracking-widest">消費排行榜</span>
      </div>

      <div class="space-y-3">
        <div 
          v-for="item in categoryStats" 
          :key="item.name"
          class="flex items-center justify-between p-4 bg-white rounded-[1.5rem] shadow-sm border border-slate-50"
        >
          <div class="flex items-center space-x-4">
            <div 
              class="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
              :style="{ backgroundColor: item.config.color }"
            >
              <component :is="item.config.icon" :size="18" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-bold text-slate-900 text-sm">{{ item.name }}</h3>
                <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{{ item.count }} 筆</span>
              </div>
              <div class="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :style="{ width: `${item.percentage}%`, backgroundColor: item.config.color }"
                ></div>
              </div>
            </div>
          </div>

          <div class="text-right">
            <p class="font-black text-slate-900 text-sm">¥ {{ item.amount.toLocaleString() }}</p>
            <p class="text-[10px] font-bold text-slate-400">{{ item.percentage }}%</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categoryStats.length === 0" class="text-center py-12">
        <p class="text-slate-300 font-bold text-sm">尚無消費紀錄</p>
        <button @click="router.back()" class="mt-2 text-ice-blue text-xs font-bold">去記一筆</button>
      </div>
    </section>
  </div>
</template>
