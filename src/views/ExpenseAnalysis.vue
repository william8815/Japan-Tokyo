<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenseStore, categoryConfig } from '../stores/expense'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { ChevronLeft, ArrowDownWideNarrow, X, ArrowUpDown } from 'lucide-vue-next'

ChartJS.register(ArcElement, Tooltip, Legend)

const router = useRouter()
const expenseStore = useExpenseStore()

// Modal State
const selectedCategory = ref(null)
const sortOrder = ref('desc') // 'desc' = 高到低, 'asc' = 低到高

// Data Processing
const categoryStats = computed(() => {
  const stats = {}
  expenseStore.expenses.forEach(e => {
    if (!stats[e.category]) {
      stats[e.category] = { name: e.category, amount: 0, count: 0 }
    }
    // 統一換算為日幣
    const amountInJPY = e.currency === 'JPY' ? e.amount : e.amount / expenseStore.customRate
    stats[e.category].amount += amountInJPY
    stats[e.category].count += 1
  })

  const total = Object.values(stats).reduce((sum, item) => sum + item.amount, 0)

  return Object.values(stats)
    .map(item => ({
      ...item,
      percentage: total ? Math.round((item.amount / total) * 100) : 0,
      config: categoryConfig[item.name]
    }))
    .sort((a, b) => b.amount - a.amount)
})

// Category Detail (filtered & sorted)
const categoryDetails = computed(() => {
  if (!selectedCategory.value) return []
  
  const filtered = expenseStore.expenses.filter(e => e.category === selectedCategory.value)
  
  return filtered.sort((a, b) => {
    return sortOrder.value === 'desc' ? b.amount - a.amount : a.amount - b.amount
  })
})

// Chart Data
const chartData = computed(() => ({
  labels: categoryStats.value.map(item => item.name),
  datasets: [{
    data: categoryStats.value.map(item => item.amount),
    backgroundColor: categoryStats.value.map(item => item.config.color),
    borderWidth: 0,
    hoverOffset: 8
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '75%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => ` ¥${Math.round(context.parsed).toLocaleString()}`
      }
    }
  }
}

// Actions
const openCategoryDetail = (categoryName) => {
  selectedCategory.value = categoryName
  sortOrder.value = 'desc' // Reset to default
}

const closeCategoryDetail = () => {
  selectedCategory.value = null
}

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
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
          <h2 class="text-3xl font-black text-slate-900 tracking-tighter">{{ Math.round(expenseStore.totalSpent).toLocaleString() }} </h2>
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
        <button 
          v-for="item in categoryStats" 
          :key="item.name"
          @click="openCategoryDetail(item.name)"
          class="w-full flex items-center justify-between p-4 bg-white rounded-[1.5rem] shadow-sm border border-slate-50 active:scale-[0.98] transition-all"
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
            <p class="font-black text-slate-900 text-sm">¥ {{ Math.round(item.amount).toLocaleString() }}</p>
            <p class="text-[10px] font-bold text-slate-400">{{ item.percentage }}%</p>
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="categoryStats.length === 0" class="text-center py-12">
        <p class="text-slate-300 font-bold text-sm">尚無消費紀錄</p>
        <button @click="router.back()" class="mt-2 text-ice-blue text-xs font-bold">去記一筆</button>
      </div>
    </section>

    <!-- Category Detail Modal -->
    <Teleport to="body">
      <div 
        v-if="selectedCategory"
        class="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-end animate-in fade-in duration-200"
        @click="closeCategoryDetail"
      >
        <div 
          class="w-full max-w-md mx-auto bg-white rounded-t-[2.5rem] p-6 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                :style="{ backgroundColor: categoryConfig[selectedCategory].color }"
              >
                <component :is="categoryConfig[selectedCategory].icon" :size="20" />
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900">{{ selectedCategory }}</h3>
                <p class="text-xs text-slate-400 font-bold">{{ categoryDetails.length }} 筆消費</p>
              </div>
            </div>
            <button @click="closeCategoryDetail" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
              <X :size="20" />
            </button>
          </div>

          <!-- Sort Toggle -->
          <button 
            @click="toggleSort"
            class="w-full flex items-center justify-between p-3 bg-slate-50 rounded-2xl mb-4 active:scale-[0.98] transition-all"
          >
            <div class="flex items-center space-x-2">
              <ArrowUpDown :size="16" class="text-slate-400" />
              <span class="text-xs font-bold text-slate-600">排序方式</span>
            </div>
            <span class="text-xs font-black text-ice-blue">
              {{ sortOrder === 'desc' ? '金額：高 → 低' : '金額：低 → 高' }}
            </span>
          </button>

          <!-- Detail List -->
          <div class="space-y-3">
            <div 
              v-for="expense in categoryDetails" 
              :key="expense.id"
              class="p-4 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <p class="text-sm font-bold text-slate-900">{{ expense.note || '無備註' }}</p>
                  <p class="text-[10px] text-slate-400 font-bold mt-1">{{ expense.date }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-black text-slate-900">¥{{ Math.round(expense.currency === 'JPY' ? expense.amount : expense.amount / expenseStore.customRate).toLocaleString() }}</p>
                  <p class="text-[10px] font-bold text-slate-400" v-if="expense.currency === 'TWD'">原價 TWD {{ Math.round(expense.amount).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
