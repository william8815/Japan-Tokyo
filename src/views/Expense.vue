<script setup>
import { ref, computed } from 'vue'
import { useExpenseStore } from '../stores/expense'
import { Plus, CreditCard, ChevronDown, Trash2, JapaneseYen, Calculator, ArrowRightLeft } from 'lucide-vue-next'

const expenseStore = useExpenseStore()
const isAdding = ref(false)
const amount = ref('')
const category = ref('餐飲')
const note = ref('')
const currency = ref('JPY') // 目前輸入的幣別

const categories = ['餐飲', '交通', '購物', '娛樂', '其他']

const handleAdd = () => {
  if (!amount.value) return
  expenseStore.addExpense({
    amount: Number(amount.value),
    category: category.value,
    note: note.value,
    currency: currency.value
  })
  amount.value = ''
  note.value = ''
  isAdding.value = false
}

const budgetProgress = computed(() => {
  return Math.min(100, Math.round((expenseStore.totalSpent / expenseStore.budget) * 100))
})
</script>

<template>
  <div class="space-y-8 pb-10">
    <header class="flex justify-between items-end px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">支出管理</h1>
        <p class="text-slate-500 font-medium">自定義匯率計帳系統</p>
      </div>
      <div class="text-right">
        <div class="flex items-center space-x-1 justify-end text-ice-blue font-black mb-1">
          <Calculator :size="14" />
          <input 
            type="number" 
            step="0.001"
            v-model="expenseStore.customRate"
            class="w-16 bg-transparent border-none p-0 text-sm focus:ring-0 text-right leading-none"
          />
        </div>
        <p class="text-[8px] font-black text-slate-300 uppercase tracking-widest">當前設定匯率 (JPY to TWD)</p>
      </div>
    </header>

    <!-- 預算看板 -->
    <section class="relative overflow-hidden group">
      <div class="absolute inset-0 bg-slate-900 rounded-[3rem] shadow-2xl"></div>
      <div class="relative p-10 text-white">
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

    <!-- 快速記帳表單 -->
    <button 
      v-if="!isAdding"
      @click="isAdding = true"
      class="w-full glass py-6 rounded-[2.5rem] border border-white flex items-center justify-center space-x-3 text-slate-700 font-black tracking-widest active:scale-95 transition-all shadow-sm"
    >
      <Plus :size="20" class="text-ice-blue" />
      <span>新增消費紀錄</span>
    </button>

    <div v-else class="glass p-8 rounded-[3rem] border border-white space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">紀錄明細</h3>
        <button @click="isAdding = false" class="text-slate-300 font-bold text-xs">取消</button>
      </div>
      
      <div class="space-y-4">
        <div class="relative">
          <input 
            v-model="amount" 
            type="number" 
            placeholder="0.00"
            class="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 text-3xl font-black text-slate-900 focus:ring-2 focus:ring-ice-blue transition-all"
          />
          <button 
            @click="currency = currency === 'JPY' ? 'TWD' : 'JPY'"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-2 text-xs font-black text-ice-blue"
          >
            <ArrowRightLeft :size="12" />
            <span>{{ currency }}</span>
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="category = cat"
            :class="['py-3 rounded-2xl text-[10px] font-black transition-all border', category === cat ? 'bg-slate-900 text-white border-transparent' : 'bg-white text-slate-400 border-slate-100']"
          >
            {{ cat }}
          </button>
        </div>

        <input 
          v-model="note" 
          type="text" 
          placeholder="備註資訊 (非必填)"
          class="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-ice-blue transition-all"
        />

        <button 
          @click="handleAdd"
          class="w-full py-5 bg-ice-blue text-white rounded-[2rem] font-black shadow-lg shadow-blue-100 active:scale-[0.98] transition-all tracking-widest uppercase text-sm"
        >
          保存這筆支出
        </button>
      </div>
    </div>

    <!-- 歷史清單 -->
    <section class="space-y-4">
      <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest px-2">消費清單 / History</h2>
      
      <div v-if="expenseStore.expenses.length === 0" class="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <p class="text-slate-300 font-bold text-sm">目前尚無銷費紀錄</p>
      </div>

      <div class="space-y-3">
        <div 
          v-for="item in expenseStore.expenses" 
          :key="item.id"
          class="glass p-5 rounded-[2rem] border border-white flex items-center justify-between shadow-sm active:scale-[0.99] transition-all"
        >
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <CreditCard :size="18" />
            </div>
            <div>
              <h4 class="text-sm font-black text-slate-800">{{ item.note || item.category }}</h4>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ item.date }} • {{ item.category }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-black text-slate-900">{{ item.currency === 'JPY' ? '¥' : '$' }} {{ item.amount.toLocaleString() }}</p>
            <p v-if="item.currency === 'JPY'" class="text-[10px] font-bold text-ice-blue">≈ ${{ (item.amount * expenseStore.customRate).toFixed(0) }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(15px);
}
</style>
