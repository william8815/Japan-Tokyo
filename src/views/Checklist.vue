<script setup>
import { ref } from 'vue'
import { useChecklistStore } from '../stores/checklist'
import { Plus, Trash2, CheckCircle2, Circle, ChevronDown, PackageCheck, ArrowLeft, ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const checklistStore = useChecklistStore()
const expanded = ref(['luggage', 'tasks'])
const newItemText = ref('')
const activeGroup = ref('luggage')

const toggleGroup = (id) => {
  if (expanded.value.includes(id)) {
    expanded.value = expanded.value.filter(i => i !== id)
  } else {
    expanded.value.push(id)
  }
}

const handleAdd = () => {
  if (!newItemText.value) return
  checklistStore.addItem(activeGroup.value, newItemText.value)
  newItemText.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <button @click="router.back()" class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all">
           <ChevronLeft :size="20" />
        </button>
        <div>
          <h1 class="text-lg font-black text-slate-800 tracking-tight">行前準備</h1>
          <!-- <p class="text-slate-500 font-medium">出發前的最後確認</p> -->
        </div>
      </div>
      <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
        <PackageCheck :size="18" class="text-ice-blue" />
        <span class="text-sm font-black text-slate-700">{{ checklistStore.totalProgress }}%</span>
      </div>
    </header>

    <!-- 進度條 -->
    <div class="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-8">
      <div 
        class="h-full bg-ice-blue transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]"
        :style="{ width: `${checklistStore.totalProgress}%` }"
      ></div>
    </div>

    <!-- 新增項目表單 -->
    <div class="glass p-4 rounded-3xl border border-white flex flex-col space-y-3 shadow-sm">
      <div class="flex space-x-2">
        <button 
          @click="activeGroup = 'luggage'"
          :class="['flex-1 py-2 text-xs font-bold rounded-xl transition-all', activeGroup === 'luggage' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400']"
        >
          行李物資
        </button>
        <button 
          @click="activeGroup = 'tasks'"
          :class="['flex-1 py-2 text-xs font-bold rounded-xl transition-all', activeGroup === 'tasks' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400']"
        >
          待辦事項
        </button>
      </div>
      <div class="relative">
        <input 
          v-model="newItemText" 
          @keyup.enter="handleAdd"
          type="text" 
          placeholder="新增確認項目..."
          class="w-full bg-white/50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm font-medium focus:ring-2 focus:ring-ice-blue transition-all"
        />
        <button 
          @click="handleAdd"
          class="absolute right-2 top-2 bottom-2 aspect-square bg-ice-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100"
        >
          <Plus :size="18" />
        </button>
      </div>
    </div>

    <!-- 清單分類 -->
    <div v-for="group in checklistStore.groups" :key="group.id" class="space-y-3">
      <button 
        @click="toggleGroup(group.id)"
        class="w-full flex justify-between items-center py-2 px-1"
      >
        <span class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ group.name }}</span>
        <ChevronDown 
          :size="14" 
          :class="['text-slate-300 transition-transform', { 'rotate-180': expanded.includes(group.id) }]" 
        />
      </button>

      <transition-group name="list" tag="div" v-if="expanded.includes(group.id)" class="space-y-3">
        <div 
          v-for="item in group.items" 
          :key="item.id"
          class="glass p-4 rounded-2xl border border-white flex items-center justify-between group transition-all"
          :class="{ 'opacity-60 grayscale-[0.5]': item.completed }"
          @click.stop="checklistStore.toggleItem(group.id, item.id)"
        >
          <div class="flex items-center space-x-4 flex-1 cursor-pointer" >
            <div :class="['transition-colors', item.completed ? 'text-ice-blue' : 'text-slate-200']">
              <CheckCircle2 v-if="item.completed" :size="22" />
              <Circle v-else :size="22" />
            </div>
            <span :class="['text-sm font-bold transition-all', item.completed ? 'text-slate-400 line-through' : 'text-slate-700']">
              {{ item.text }}
            </span>
          </div>
          
          <button 
            @click.stop="checklistStore.removeItem(group.id, item.id)"
            class="p-2 text-red-400 transition-colors"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
