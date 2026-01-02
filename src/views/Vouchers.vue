<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  QrCode, Image as ImageIcon, Plus, Trash2, X, Pencil, Upload, ChevronLeft 
} from 'lucide-vue-next'
import { useVoucherStore } from '../stores/voucher'

const router = useRouter()
const voucherStore = useVoucherStore()

// Voucher Modal State
const isVoucherModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isLightboxOpen = ref(false)
const editingVoucherId = ref(null)
const deleteConfirmId = ref(null)
const lightboxImage = ref('')

// Form Data
const voucherTitle = ref('')
const voucherNote = ref('')
const voucherImage = ref(null)

// Actions
const openLightbox = (url) => {
  lightboxImage.value = url
  isLightboxOpen.value = true
}

const openAddVoucherModal = () => {
  editingVoucherId.value = null
  voucherTitle.value = ''
  voucherNote.value = ''
  voucherImage.value = null
  isVoucherModalOpen.value = true
}

const openEditVoucherModal = (item) => {
  editingVoucherId.value = item.id
  voucherTitle.value = item.title
  voucherNote.value = item.note || ''
  voucherImage.value = item.url
  isVoucherModalOpen.value = true
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (res) => {
    voucherImage.value = res.target.result
  }
  reader.readAsDataURL(file)
}

const handleSaveVoucher = () => {
  if (!voucherTitle.value || !voucherImage.value) return 

  const payload = {
    title: voucherTitle.value,
    note: voucherNote.value,
    url: voucherImage.value
  }

  if (editingVoucherId.value) {
    voucherStore.updateVoucher(editingVoucherId.value, payload)
  } else {
    voucherStore.addVoucher(payload)
  }
  isVoucherModalOpen.value = false
}

const openDeleteModal = (id) => {
  deleteConfirmId.value = id
  isDeleteModalOpen.value = true
}

const confirmDeleteVoucher = () => {
  if (deleteConfirmId.value) {
    voucherStore.deleteVoucher(deleteConfirmId.value)
    isDeleteModalOpen.value = false
    deleteConfirmId.value = null
  }
}
</script>

<template>
  <div class="space-y-6 ">
    <!-- Header with Back Button -->
    <header class="flex items-center px-2 py-2">
      <button @click="router.back()" class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all">
          <ChevronLeft :size="20" />
      </button>
      <h1 class="text-xl font-black text-slate-900 tracking-tight ml-2">我的憑證</h1>
    </header>

    <!-- 內容區：數位憑證 -->
    <div class="space-y-6 animate-in fade-in duration-500 px-1">
      
      <!-- 新增按鈕區 -->
      <div class="flex justify-between items-center px-1">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">已存憑證 ({{ voucherStore.vouchers.length }})</h2>
        <button 
          @click="openAddVoucherModal"
          class="flex items-center space-x-1 text-[10px] font-black text-ice-blue bg-ice-blue/10 px-3 py-1.5 rounded-full hover:bg-ice-blue/20 transition-colors"
        >
          <Plus :size="12" />
          <span>新增憑證</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 上傳按鈕 (快捷入口) -->
        <button 
          @click="openAddVoucherModal"
          class="aspect-[3/4] glass rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3 hover:border-ice-blue hover:bg-blue-50/30 transition-all group"
        >
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 group-hover:text-ice-blue transition-colors">
            <Plus :size="24" />
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">新增憑證</span>
        </button>

        <!-- 憑證卡片 -->
        <div 
          v-for="v in voucherStore.vouchers" 
          :key="v.id" 
          @click="openLightbox(v.url)"
          class="aspect-[3/4] relative group rounded-[2.5rem] overflow-hidden shadow-sm border border-white cursor-pointer"
        >
          <img :src="v.url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12">
            <p class="text-white text-sm font-black truncate">{{ v.title }}</p>
            <p class="text-white/70 text-[10px] truncate font-medium mt-0.5">{{ v.note || '無備註' }}</p>
          </div>
          
          <!-- 操作按鈕群 -->
          <div class="absolute top-3 right-3 flex space-x-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click.stop="openEditVoucherModal(v)"
              class="p-2 bg-black/30 backdrop-blur-md rounded-xl text-white hover:bg-ice-blue transition-colors"
            >
              <Pencil :size="14" />
            </button>
            <button 
              @click.stop="openDeleteModal(v.id)"
              class="p-2 bg-black/30 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div class="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex items-center space-x-4">
        <QrCode :size="32" class="text-slate-300" />
        <p class="text-xs font-bold text-slate-400 leading-relaxed">提示：點擊卡片可放大顯示 QR Code，方便掃描。</p>
      </div>
    </div>

    <!-- Teleport Modals -->
    <Teleport to="body">
      <!-- Lightbox Modal -->
      <div 
        v-if="isLightboxOpen" 
        class="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
        @click="isLightboxOpen = false"
      >
        <img :src="lightboxImage" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
        <p class="text-white/50 text-xs font-bold mt-6 tracking-widest uppercase">點擊任意處關閉</p>
      </div>

      <!-- Add/Edit Voucher Modal -->
      <div v-if="isVoucherModalOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70">
        <div 
          class="w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-black text-slate-900 tracking-tight">{{ editingVoucherId ? '編輯憑證' : '新增憑證' }}</h3>
            <button @click="isVoucherModalOpen = false" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100">
              <X :size="20" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- 圖片上傳/預覽區 -->
            <div class="relative group">
              <div class="aspect-video w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center relative">
                <img v-if="voucherImage" :src="voucherImage" class="w-full h-full object-contain bg-slate-100" />
                
                <div v-else class="flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon :size="32" class="mb-2" />
                  <span class="text-[10px] font-black uppercase tracking-widest">點擊上傳圖片</span>
                </div>

                <!-- Overlay for changing image -->
                <label class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
                  <span class="text-white text-xs font-bold border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    {{ voucherImage ? '更換圖片' : '選擇圖片' }}
                  </span>
                </label>
                
                <!-- 初始無圖片時的點擊區域 -->
                <label v-if="!voucherImage" class="absolute inset-0 cursor-pointer">
                  <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
                </label>
              </div>
            </div>

            <!-- 資訊表單 -->
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">名稱 (Required)</label>
                <input 
                  v-model="voucherTitle" 
                  type="text" 
                  placeholder="例如：Skyliner 車票"
                  class="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:ring-2 focus:ring-ice-blue transition-all"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">備註 (Optional)</label>
                <textarea 
                  v-model="voucherNote" 
                  rows="3"
                  placeholder="訂單編號、使用期限等資訊..."
                  class="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-ice-blue transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              @click="handleSaveVoucher"
              :disabled="!voucherTitle || !voucherImage"
              class="w-full py-5 bg-ice-blue text-white rounded-[2rem] font-black shadow-lg shadow-blue-100 active:scale-[0.98] transition-all tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ editingVoucherId ? '儲存變更' : '新增憑證' }}
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
            <p class="text-sm text-slate-500 font-medium">刪除後將無法復原，確定要移除這張憑證嗎？</p>
            
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button 
                @click="isDeleteModalOpen = false" 
                class="py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button 
                @click="confirmDeleteVoucher" 
                class="py-3 bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
</style>
