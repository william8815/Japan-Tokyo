<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenseStore, categoryConfig, categories } from '../stores/expense'
import { useItineraryStore } from '../stores/itinerary'
import { Plus, ChevronDown, Trash2, JapaneseYen, Calculator, ArrowRightLeft, X, Pencil, Settings, PieChart } from 'lucide-vue-next'

const router = useRouter()
const expenseStore = useExpenseStore()
const itineraryStore = useItineraryStore()

// State
const activeDay = ref(1) // 對應 itineraryStore 的 Day ID
const isModalOpen = ref(false)
const editingId = ref(null) // 若有值代表編輯模式

// Settings Modal
const isSettingsModalOpen = ref(false)
const tempRate = ref(0.22)

// Form Data
const amount = ref('')
const category = ref('餐飲')
const note = ref('')
const currency = ref('JPY')

// Computed
const budgetProgress = computed(() => {
  return Math.min(100, Math.round((expenseStore.totalSpent / expenseStore.budget) * 100))
})

// 依據 activeDay 篩選當日支出
const currentDayDate = computed(() => {
  const day = itineraryStore.days.find(d => d.id === activeDay.value)
  return day ? day.date : ''
})

const filteredExpenses = computed(() => {
  if (!currentDayDate.value) return []
  const targetDate = formatDate(currentDayDate.value) // MM/DD
  
  return expenseStore.expenses.filter(item => {
    return item.date === targetDate || item.isoDate === currentDayDate.value
  })
})

// Helper
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${m}/${d}`
}

// 刪除確認相關 State
const deleteConfirmId = ref(null)
const isDeleteModalOpen = ref(false)

// Actions
const openAddModal = () => {
  editingId.value = null
  amount.value = ''
  category.value = '餐飲'
  note.value = ''
  currency.value = 'JPY'
  isModalOpen.value = true
}

const openEditModal = (item) => {
  editingId.value = item.id
  amount.value = item.amount
  category.value = item.category
  note.value = item.note || ''
  currency.value = item.currency
  isModalOpen.value = true
}

const openDeleteModal = (id) => {
  deleteConfirmId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (deleteConfirmId.value) {
    expenseStore.deleteExpense(deleteConfirmId.value)
    isDeleteModalOpen.value = false
    deleteConfirmId.value = null
  }
}

const handleSave = () => {
  if (!amount.value) return
  
  const payload = {
    amount: Number(amount.value),
    category: category.value,
    note: note.value,
    currency: currency.value,
    ...(editingId.value ? {} : { 
      isoDate: currentDayDate.value, 
      date: formatDate(currentDayDate.value)
    })
  }

  if (editingId.value) {
    expenseStore.updateExpense(editingId.value, payload)
  } else {
    expenseStore.addExpense(payload)
  }
  
  isModalOpen.value = false
}

// Settings Actions
const openSettingsModal = () => {
  tempRate.value = expenseStore.customRate
  isSettingsModalOpen.value = true
}

const saveRateSettings = () => {
  expenseStore.customRate = Number(tempRate.value)
  isSettingsModalOpen.value = false
}

// Init
onMounted(() => {
  const todayStr = new Date().toLocaleDateString('en-CA')
  const today = itineraryStore.days.find(d => d.date === todayStr)
  if (today) {
    activeDay.value = today.id
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex justify-between items-end px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">支出管理</h1>
        <p class="text-slate-500 font-medium">自定義匯率計帳系統</p>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="openSettingsModal"
          class="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-ice-blue hover:border-ice-blue transition-all"
        >
          <Settings :size="20" />
        </button>
        <button 
          @click="router.push('/expense/analysis')"
          class="p-2.5 bg-slate-900 rounded-xl shadow-lg shadow-slate-200 text-white hover:bg-slate-800 active:scale-95 transition-all"
        >
          <PieChart :size="20" />
        </button>
      </div>
    </header>

    <!-- 預算看板 -->
    <section class="relative group mb-6">
      <div class="relative p-10 text-white bg-slate-900 rounded-[2.5rem] shadow-2xl">
        <div class="flex justify-between items-start mb-10">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">總合支出 / Total Spent</p>
            <div class="flex items-baseline space-x-2">
              <span class="text-xs font-bold text-slate-500">¥</span>
              <h2 class="text-5xl font-black tracking-tighter">{{ expenseStore.totalSpent.toLocaleString() }}</h2>
            </div>
            <p class="text-sm font-bold text-ice-blue mt-2">≈ TWD {{ parseFloat(expenseStore.totalSpentTWD).toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <JapaneseYen :size="24" class="text-ice-blue" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span class="text-slate-400">旅費進度</span>
            <span :class="budgetProgress > 80 ? 'text-red-400' : 'text-ice-blue'">{{ budgetProgress }}%</span>
          </div>
          <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-1000 ease-out"
              :class="budgetProgress > 80 ? 'bg-red-400' : 'bg-ice-blue shadow-[0_0_10px_rgba(56,189,248,0.5)]'"
              :style="{ width: `${budgetProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Date Tabs (Sticky) -->
    <div class="sticky top-0 z-40 pt-4 pb-2 -mx-4 px-6 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div class="tab-list flex gap-3 overflow-x-scroll scrollbar-hide items-center pb-2">
        <button 
          v-for="day in itineraryStore.days" 
          :key="day.id"
          @click="activeDay = day.id"
          class="flex-shrink-0 px-6 py-4 rounded-[2rem] transition-all duration-300 font-bold text-sm transform-origin-center ring-1 ring-inset"
          :class="activeDay === day.id 
            ? 'bg-ice-blue text-white shadow-md ring-transparent' 
            : 'bg-white text-slate-400 ring-slate-100'"
        >
          {{ formatDate(day.date) }}
          <span class="block text-[8px] opacity-50 uppercase mt-1">Day {{ day.id }}</span>
        </button>
      </div>
    </div>

    <!-- 列表與新增按鈕 -->
    <div class="space-y-4 min-h-[300px]">
      <div class="flex justify-between items-center px-2">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">Day {{ activeDay }} 消費紀錄</h2>
        <button 
          @click="openAddModal"
          class="flex items-center space-x-1 text-[10px] font-black text-ice-blue bg-ice-blue/10 px-3 py-1.5 rounded-full hover:bg-ice-blue/20 transition-colors"
        >
          <Plus :size="12" />
          <span>新增</span>
        </button>
      </div>

      <div v-if="filteredExpenses.length === 0" class="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
        <p class="text-slate-300 font-bold text-sm">本日尚無紀錄</p>
        <button @click="openAddModal" class="mt-4 text-ice-blue font-bold text-xs underline">立即記一筆</button>
      </div>

      <div class="space-y-3">
        <div 
          v-for="item in filteredExpenses" 
          :key="item.id"
          @click="openEditModal(item)"
          class="glass p-5 rounded-[2rem] border border-white flex items-center justify-between shadow-sm active:scale-[0.99] transition-all cursor-pointer group"
        >
          <div class="flex items-center space-x-4">
            <!-- Dynamic Category Icon & Color -->
            <div 
              class="p-3 rounded-2xl transition-colors text-white shadow-sm"
              :class="categoryConfig[item.category].bg"
            >
              <component :is="categoryConfig[item.category].icon" :size="18" />
            </div>
            <div>
              <h4 class="text-sm font-black text-slate-800">{{ item.note || item.category }}</h4>
              <p class="text-[10px] font-bold uppercase tracking-tighter" :class="categoryConfig[item.category].text">
                {{ item.category }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm font-black text-slate-900">{{ item.currency === 'JPY' ? '¥' : '$' }} {{ item.amount.toLocaleString() }}</p>
              <p v-if="item.currency === 'JPY'" class="text-[10px] font-bold text-ice-blue">≈ ${{ (item.amount * expenseStore.customRate).toFixed(0) }}</p>
            </div>
            <button 
              @click.stop="openDeleteModal(item.id)"
              class="p-2 text-slate-300 hover:text-red-400 transition-colors"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Container -->
    <Teleport to="body">
      <!-- Add/Edit Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70">
        <div 
          class="w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
          @click.stop
        >
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-lg font-black text-slate-900 tracking-tight">{{ editingId ? '編輯支出' : '新增支出' }}</h3>
            <button @click="isModalOpen = false" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100">
              <X :size="20" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Amount Input -->
            <div class="relative">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">金額 (Amount)</label>
              <input 
                v-model="amount" 
                type="number" 
                placeholder="0.00"
                class="w-full bg-slate-50 border-none rounded-[2rem] py-5 px-6 text-3xl font-black text-slate-900 focus:ring-2 focus:ring-ice-blue transition-all relative z-10"
              />
              <button 
                @click="currency = currency === 'JPY' ? 'TWD' : 'JPY'"
                class="absolute right-4 top-[34px] bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-1.5 text-[10px] font-black text-ice-blue z-20"
              >
                <ArrowRightLeft :size="10" />
                <span>{{ currency }}</span>
              </button>
            </div>

            <!-- Category Select (New Grid Design) -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">類別 (Category)</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  @click="category = cat"
                  class="py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border"
                  :class="category === cat 
                    ? [categoryConfig[cat].bg, 'text-white border-transparent shadow-md'] 
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'"
                >
                  <component :is="categoryConfig[cat].icon" :size="18" />
                  <span class="text-[10px] font-bold">{{ cat }}</span>
                </button>
              </div>
            </div>

            <!-- Note Input -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">備註 (Note)</label>
              <input 
                v-model="note" 
                type="text" 
                placeholder="例如：超商零食..."
                class="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-ice-blue transition-all"
              />
            </div>

            <button 
              @click="handleSave"
              class="w-full py-5 bg-ice-blue text-white rounded-[2rem] font-black shadow-lg shadow-blue-100 active:scale-[0.98] transition-all tracking-widest uppercase text-sm mt-4"
            >
              {{ editingId ? '確認修改' : '新增紀錄' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div 
          class="w-full max-w-xs bg-white rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          @click.stop
        >
          <div class="text-center space-y-4">
            <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 :size="24" />
            </div>
            <h3 class="text-lg font-black text-slate-900">確認刪除</h3>
            <p class="text-sm text-slate-500 font-medium">刪除後將無法復原，確定要移除這筆支出紀錄嗎？</p>
            
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button 
                @click="isDeleteModalOpen = false" 
                class="py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button 
                @click="confirmDelete" 
                class="py-3 bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Modal -->
      <div v-if="isSettingsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div 
          class="w-full max-w-xs bg-white rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          @click.stop
        >
          <div class="text-center space-y-4">
            <div class="w-12 h-12 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto">
              <Settings :size="24" />
            </div>
            <h3 class="text-lg font-black text-slate-900">設定匯率</h3>
            <p class="text-sm text-slate-500 font-medium">輸入 JPY 對 TWD 的匯率<br>(例如 0.22 = 100 JPY 換 22 TWD)</p>
            
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
               <input 
                v-model="tempRate" 
                type="number" 
                step="0.001"
                class="w-full bg-transparent text-center text-3xl font-black text-slate-900 border-none focus:ring-0 p-0"
              />
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
              <button 
                @click="isSettingsModalOpen = false" 
                class="py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button 
                @click="saveRateSettings" 
                class="py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all"
              >
                儲存設定
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(15px);
}
</style>
