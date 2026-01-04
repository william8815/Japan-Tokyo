<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useItineraryStore } from '../stores/itinerary'
import { TRIP_CONFIG } from '../config/tripConfig'
import { 
  MapPin, Clock, Info, ChevronRight, Train, Utensils, Camera, CheckCircle2, 
  Navigation, X, Edit, Trash2, Plus, CheckSquare, Save 
} from 'lucide-vue-next'

const route = useRoute()
const itineraryStore = useItineraryStore()
const activeDay = ref(1)

// Modal State
const selectedItem = ref(null)
const showDetailModal = ref(false)
const showTimePickerModal = ref(false)
const showEditModal = ref(false)
const showAddModal = ref(false)
const customTime = ref('')
const addAfterItemId = ref(null)

// Edit Form
const editForm = ref({
  time: '',
  location: '',
  desc: '',
  type: 'attraction'
})

// Add Form
const addForm = ref({
  time: '',
  location: '',
  desc: '',
  type: 'attraction'
})

// 計算下一個需要打卡的項目 ID (全域搜尋)
const nextActionId = computed(() => {
  for (const day of itineraryStore.days) {
    const found = day.items.find(item => !item.actualArrival)
    if (found) return found.id
  }
  return null
})

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

// 根據設定檔顯示日期範圍
const rangeDisplay = TRIP_CONFIG.info.rangeDisplay

onMounted(() => {
  if (route.query.itemId) {
    const itemId = Number(route.query.itemId)
    itineraryStore.days.forEach(day => {
      const found = day.items.find(i => i.id === itemId)
      if (found) {
        activeDay.value = day.id
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

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${m}/${d}`
}

// 快速打卡（使用當前時間）
const handleQuickCheckIn = (id) => {
  itineraryStore.checkIn(id, 'arrival')
}

// 開啟詳細 Modal
const openDetailModal = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

// 關閉詳細 Modal
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
}

// 開啟編輯 Modal
const openEditModal = () => {
  editForm.value = {
    time: selectedItem.value.time,
    actualArrival: selectedItem.value.actualArrival || '',
    location: selectedItem.value.location,
    desc: selectedItem.value.desc,
    type: selectedItem.value.type
  }
  showDetailModal.value = false
  showEditModal.value = true
}

// 儲存編輯
const saveEdit = () => {
  if (editForm.value.time && editForm.value.location) {
    itineraryStore.updateItem(selectedItem.value.id, {
      time: editForm.value.time,
      actualArrival: editForm.value.actualArrival,
      location: editForm.value.location,
      desc: editForm.value.desc,
      type: editForm.value.type
    })
    showEditModal.value = false
    selectedItem.value = null
  }
}

// 開啟新增 Modal
const openAddModal = (afterItemId) => {
  addAfterItemId.value = afterItemId
  addForm.value = {
    time: '',
    location: '',
    desc: '',
    type: 'attraction'
  }
  showAddModal.value = true
}

// 儲存新增
const saveAdd = () => {
  if (addForm.value.time && addForm.value.location) {
    itineraryStore.addItem(activeDay.value, {
      time: addForm.value.time,
      location: addForm.value.location,
      desc: addForm.value.desc,
      type: addForm.value.type
    })
    showAddModal.value = false
    addForm.value = {
      time: '',
      location: '',
      desc: '',
      type: 'attraction'
    }
  }
}

// 刪除行程項目
const deleteItem = (id) => {
  if (confirm('確定要刪除這個行程項目嗎？')) {
    itineraryStore.deleteItem(id)
    closeDetailModal()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <header class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">行程排程</h1>
      </div>
      
      <!-- 行前準備快捷按鈕 -->
      <RouterLink to="/checklist" class="flex items-center space-x-1.5 bg-blue-50 text-blue-500 px-3 py-2 rounded-full active:scale-95 transition-all outline-none ring-2 ring-blue-100 hover:bg-blue-100">
        <CheckSquare :size="14" />
        <span class="text-[12px] font-bold">行前準備</span>
      </RouterLink>
    </header>

    <!-- 天數切換 Tab (Sticky) -->
    <div class="sticky top-0 z-40 pt-4 pb-4 -mx-4 px-6 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div class="tab-list flex gap-3 overflow-x-auto scrollbar-hide items-center">
        <button 
          v-for="day in itineraryStore.days" 
          :key="day.id"
          @click="activeDay = day.id"
          class="flex-shrink-0 px-6 py-4 rounded-[2rem] transition-all duration-300 font-bold text-sm transform-origin-center ring-1 ring-inset"
          :class="activeDay === day.id 
            ? 'bg-ice-blue text-white shadow-lg shadow-blue-200/50 ring-transparent' 
            : 'bg-white text-slate-400 ring-slate-100 scale-100'"
        >
          {{ formatDate(day.date) }}
          <span class="block text-[8px] opacity-70 uppercase mt-1">Day {{ day.id }}</span>
        </button>
      </div>
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
            <!-- 停留時間顯示 -->
            <div v-if="index < day.items.length - 1 && item.actualArrival && day.items[index+1].actualArrival" class="absolute left-6 -top-3 z-20">
              <div class="bg-ice-blue text-[10px] text-white px-3 py-1 rounded-full font-black flex items-center space-x-1 shadow-lg shadow-blue-100 ring-2 ring-white">
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
              @click="openDetailModal(item)"
              class="w-full text-left relative glass p-5 rounded-[2.5rem] border transition-all duration-500 shadow-sm group"
              :class="item.actualArrival ? 'bg-ice-blue/[0.03] border-ice-blue/10 scale-[0.98]' : 'bg-white border-white active:scale-[0.99]'"
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
                
                <!-- 狀態顯示與操作區 -->
                <div v-if="item.actualArrival" class="text-right">
                  <p class="text-[10px] font-black text-ice-blue uppercase tracking-widest opacity-60">已打卡</p>
                  <p class="text-sm font-black text-slate-900">{{ item.actualArrival }}</p>
                </div>
                
                <!-- 智慧打卡按鈕：全域唯一，僅顯示在當前最近的未完成項目 -->
                <button 
                  v-else-if="item.id === nextActionId"
                  @click.stop="handleQuickCheckIn(item.id)"
                  class="bg-ice-blue text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all animate-bounce"
                >
                  打卡
                </button>
              </div>
              <!-- 行程描述 : 超過 2 行以 ... 結束 -->
              <p class="text-sm text-slate-500 font-medium leading-normal pl-2 border-l-2 border-slate-50 line-clamp-2 whitespace-pre-wrap">{{ item.desc }}</p>
            </div>
          </div>

          <!-- 最後新增按鈕 -->
          <button 
            @click="openAddModal(null)"
            class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-ice-blue hover:text-ice-blue hover:bg-ice-blue/5 transition-all flex items-center justify-center space-x-2"
          >
            <Plus :size="16" />
            <span>新增行程</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div 
        v-if="showDetailModal && selectedItem"
        class="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-end animate-in fade-in duration-200"
        @click="closeDetailModal"
      >
        <div 
          class="w-full max-w-md mx-auto bg-white rounded-t-[2.5rem] shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-start justify-between sticky top-0 bg-white z-[10] p-6 border-b border-slate-200">
            <div class="flex items-center space-x-4">
              <div 
                :class="['p-4 rounded-2xl', getTypeConfig(selectedItem.type).color]"
              >
                <component :is="getTypeConfig(selectedItem.type).icon" :size="24" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ getTypeConfig(selectedItem.type).label }}</p>
                <h3 class="text-2xl font-black text-slate-900">{{ selectedItem.location }}</h3>
              </div>
            </div>
            <button @click="closeDetailModal" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
              <X :size="20" />
            </button>
          </div>

          <!-- Time Info -->
          <div class="bg-slate-50 rounded-2xl p-5">
            <div class="grid grid-cols-[1fr_auto_1fr] justify-between gap-4">
              <div class="text-center">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">預計抵達</p>
                <p class="text-2xl font-black text-slate-900">{{ selectedItem.time }}</p>
              </div>
              <!-- Time Difference (Compact) -->
              <div class="mt-3 pt-3">
                <span v-if="selectedItem.actualArrival" class="text-xs font-black" :class="calculateDiff(selectedItem.time, selectedItem.actualArrival).includes('晚') ? 'text-red-500' : calculateDiff(selectedItem.time, selectedItem.actualArrival) === '準點' ? 'text-blue-500' : 'text-green-500'">
                  {{ calculateDiff(selectedItem.time, selectedItem.actualArrival) }}
                </span>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">實際抵達</p>
                <p class="text-2xl font-black" :class="selectedItem.actualArrival ? 'text-ice-blue' : 'text-slate-300'">
                  {{ selectedItem.actualArrival || '--:--' }}
                </p>
              </div>
            </div>
            <!--  -->
          </div>

          <!-- Description -->
          <div class="p-5">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">行程描述</p>
            <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{{ selectedItem.desc }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="sticky bottom-0 bg-white grid grid-cols-[1fr_auto_auto] gap-3 p-5 border-t border-slate-200">
            <!-- Quick Check-in -->
            <button 
              v-if="!selectedItem.actualArrival"
              @click="handleQuickCheckIn(selectedItem.id); closeDetailModal()"
              class="py-4 bg-ice-blue text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
            >
              立即打卡
            </button>
            <button 
              v-else
              disabled
              class="py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed"
            >
              已打卡
            </button>

            <!-- Edit Button -->
            <button 
              @click="openEditModal"
              class="p-4 bg-ice-blue/20 text-ice-blue rounded-2xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Edit :size="16" />
            </button>

            <!-- Delete -->
            <button 
              @click="deleteItem(selectedItem.id)"
              class="p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div 
        v-if="showEditModal"
        class="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
        @click="showEditModal = false"
      >
        <div 
          class="w-[90%] max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <h3 class="text-xl font-black text-slate-900 mb-6">編輯行程</h3>
          
          <div class="space-y-4">
            <!-- Time -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">預設時間</label>
              <input 
                v-model="editForm.time"
                type="time"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-ice-blue focus:outline-none"
              />
            </div>
            <!-- Time -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">實際時間</label>
              <input 
                v-model="editForm.actualArrival"
                type="time"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-ice-blue focus:outline-none"
              />
            </div>

            <!-- Location -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">地點名稱</label>
              <input 
                v-model="editForm.location"
                type="text"
                placeholder="例：淺草寺"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-ice-blue focus:outline-none"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">行程描述</label>
              <textarea 
                v-model="editForm.desc"
                rows="3"
                placeholder="例：參觀寺廟、購買御守"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:border-ice-blue focus:outline-none resize-none"
              ></textarea>
            </div>

            <!-- Type -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">類別</label>
              <div class="grid grid-cols-4 gap-2">
                <button 
                  v-for="type in ['transport', 'food', 'attraction', 'other']" 
                  :key="type"
                  @click="editForm.type = type"
                  :class="['p-3 rounded-2xl border-2 transition-all flex items-center justify-center', editForm.type === type ? 'border-ice-blue bg-ice-blue/10' : 'border-slate-200 bg-white']"
                >
                  <component :is="getTypeConfig(type).icon" :size="20" :class="editForm.type === type ? 'text-ice-blue' : 'text-slate-400'" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              @click="showEditModal = false"
              class="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all"
            >
              取消
            </button>
            <button 
              @click="saveEdit"
              class="flex-1 py-3 bg-ice-blue text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Save :size="16" />
              <span>儲存</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Modal -->
      <div 
        v-if="showAddModal"
        class="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
        @click="showAddModal = false"
      >
        <div 
          class="w-[90%] max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <h3 class="text-xl font-black text-slate-900 mb-6">新增行程</h3>
          
          <div class="space-y-4">
            <!-- Time -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">時間</label>
              <input 
                v-model="addForm.time"
                type="time"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-ice-blue focus:outline-none"
              />
            </div>

            <!-- Location -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">地點名稱</label>
              <input 
                v-model="addForm.location"
                type="text"
                placeholder="例：淺草寺"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-ice-blue focus:outline-none"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">行程描述</label>
              <textarea 
                v-model="addForm.desc"
                rows="3"
                placeholder="例：參觀寺廟、購買御守"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:border-ice-blue focus:outline-none resize-none"
              ></textarea>
            </div>

            <!-- Type -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">類別</label>
              <div class="grid grid-cols-4 gap-2">
                <button 
                  v-for="type in ['transport', 'food', 'attraction', 'other']" 
                  :key="type"
                  @click="addForm.type = type"
                  :class="['p-3 rounded-2xl border-2 transition-all flex items-center justify-center', addForm.type === type ? 'border-ice-blue bg-ice-blue/10' : 'border-slate-200 bg-white']"
                >
                  <component :is="getTypeConfig(type).icon" :size="20" :class="addForm.type === type ? 'text-ice-blue' : 'text-slate-400'" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              @click="showAddModal = false"
              class="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all"
            >
              取消
            </button>
            <button 
              @click="saveAdd"
              class="flex-1 py-3 bg-ice-blue text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Plus :size="16" />
              <span>新增</span>
            </button>
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
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
</style>
