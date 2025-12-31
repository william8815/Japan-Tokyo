<script setup>
import { ref } from 'vue'
import { useExpenseStore } from '../stores/expense'
import { Plus, Trash2, Utensils, Train, ShoppingBag, MoreHorizontal, Wallet, ArrowDown } from 'lucide-vue-next'

const expenseStore = useExpenseStore()
const showAdd = ref(false)

const newExpense = ref({
  amount: '',
  category: 'food',
  note: ''
})

const categories = {
  food: { label: '餐飲', icon: Utensils, color: 'text-orange-500 bg-orange-100' },
  transport: { label: '交通', icon: Train, color: 'text-blue-500 bg-blue-100' },
  shop: { label: '購物', icon: ShoppingBag, color: 'text-pink-500 bg-pink-100' },
  other: { label: '其他', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-100' }
}

const handleAdd = () => {
  if (!newExpense.value.amount) return
  expenseStore.addExpense({
    amount: Number(newExpense.value.amount),
    category: newExpense.value.category,
    note: newExpense.value.note || categories[newExpense.value.category].label
  })
  newExpense.value = { amount: '', category: 'food', note: '' }
  showAdd.value = false
}

const budgetProgress = () => {
  const percent = (expenseStore.totalSpent / expenseStore.budget) * 100
  return Math.min(percent, 100)
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">支出管理</h1>
        <p class="text-slate-500 font-medium">預算剩餘：¥{{ expenseStore.remainingBudget.toLocaleString() }}</p>
      </div>
      <button 
        @click="showAdd = !showAdd"
        class="bg-ice-blue text-white p-4 rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus v-if="!showAdd" :size="24" />
        <span v-else class="text-sm font-bold">取消</span>
      </button>
    </header>

    <!-- 預算統計看板 -->
    <section class="glass p-6 rounded-[2.5rem] border border-white shadow-sm ring-1 ring-slate-100/50 space-y-6">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
          <Wallet :size="24" />
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">目前總支出</p>
          <div class="flex items-baseline space-x-2">
            <span class="text-3xl font-black text-slate-900 font-mono">¥{{ expenseStore.totalSpent.toLocaleString() }}</span>
            <span class="text-slate-400 text-sm font-bold">≈ NT${{ expenseStore.totalSpentTWD }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-xs font-bold">
          <span class="text-slate-400 uppercase tracking-tighter">Budget Progress</span>
          <span :class="budgetProgress() > 90 ? 'text-red-500' : 'text-ice-blue'">{{ budgetProgress().toFixed(1) }}%</span>
        </div>
        <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-ice-blue transition-all duration-1000 ease-out"
            :style="{ width: `${budgetProgress()}%` }"
          ></div>
        </div>
      </div>
    </section>

    <!-- 新增支出表單 -->
    <transition name="slide">
      <section v-if="showAdd" class="glass p-6 rounded-3xl border border-white shadow-inner bg-slate-50/50 space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <label class="text-xs font-bold text-slate-400 block mb-2 px-1">金額 (JPY)</label>
            <input 
              v-model="newExpense.amount" 
              type="number" 
              placeholder="0"
              class="w-full bg-white border-none rounded-2xl p-4 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-ice-blue transition-shadow"
            />
          </div>
          <div class="col-span-2">
            <label class="text-xs font-bold text-slate-400 block mb-2 px-1">備註 (可選)</label>
            <input 
              v-model="newExpense.note" 
              type="text" 
              placeholder="敘敘苑、伴手禮等" 
              class="w-full bg-white border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-ice-blue transition-shadow font-medium"
            />
          </div>
          <div 
            v-for="(cat, key) in categories" 
            :key="key"
            @click="newExpense.category = key"
            class="flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border-2"
            :class="newExpense.category === key ? 'bg-white border-ice-blue ring-1 ring-blue-100 shadow-sm' : 'bg-white/50 border-transparent'"
          >
            <div :class="['p-2 rounded-xl', cat.color]">
              <component :is="cat.icon" :size="18" />
            </div>
            <span class="text-sm font-bold text-slate-700">{{ cat.label }}</span>
          </div>
        </div>
        <button 
          @click="handleAdd"
          class="w-full bg-slate-900 text-white p-4 rounded-2xl font-black hover:bg-slate-800 transition-colors mt-2"
        >
          確認新增記錄
        </button>
      </section>
    </transition>

    <!-- 支出清單 -->
    <section class="space-y-4">
      <div class="flex items-center space-x-2 px-2">
        <ArrowDown :size="16" class="text-slate-400" />
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">近期紀錄</h3>
      </div>

      <div v-if="expenseStore.expenses.length === 0" class="text-center py-10 opacity-30">
        <p class="text-sm font-medium">尚無支出記錄</p>
      </div>

      <div 
        v-for="item in expenseStore.expenses" 
        :key="item.id"
        class="glass p-4 rounded-3xl border border-white flex justify-between items-center group animate-in fade-in slide-in-from-left-4 duration-300"
      >
        <div class="flex items-center space-x-4">
          <div :class="['p-3 rounded-2xl', categories[item.category].color]">
            <component :is="categories[item.category].icon" :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900">{{ item.note }}</h4>
            <p class="text-[10px] text-slate-400 font-bold uppercase">{{ item.date }} · {{ categories[item.category].label }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="font-black text-slate-900 tracking-tighter">¥{{ item.amount.toLocaleString() }}</p>
            <p class="text-[10px] text-slate-400 font-bold text-right">≈ NT${{ (item.amount * expenseStore.exchangeRate).toFixed(0) }}</p>
          </div>
          <button @click="expenseStore.removeExpense(item.id)" class="text-slate-100 group-hover:text-red-300 transition-colors p-1">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 500px;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}
</style>
