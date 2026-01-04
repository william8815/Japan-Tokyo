<script setup>
import { useRouter } from 'vue-router'
import { MessageSquare, QrCode, ChevronRight, Download, Trash2 } from 'lucide-vue-next'

const router = useRouter()

const clearData = () => {
  // 請使用者確認是否要清除所有資料
  if (!confirm('確定要清除所有資料嗎？')) return
  // 清除 checklist、expense、voucher、itinerary
  localStorage.removeItem('checklist')
  localStorage.removeItem('expenses')
  localStorage.removeItem('vouchers')
  localStorage.removeItem('itinerary')
  // 因為 PWA 的特性，需要重新載入頁面
  location.reload()
}
</script>

<template>
  <div class="space-y-6">
    <header class="px-2 flex items-center justify-between">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">旅遊工具箱</h1>
      <!-- 想要新增一個按鈕，可以讓使用者清空在 LocalStorage 儲存的資料 -->
      <button 
        @click="clearData"
        class="flex items-center space-x-1.5 bg-blue-50 text-blue-500 px-3 py-2 rounded-full active:scale-95 transition-all outline-none ring-2 ring-blue-100 hover:bg-blue-100"
      >
        <Trash2 :size="14" />
        <span class="text-[12px] font-bold">清除緩存</span>
      </button>
    </header>

    <div class="space-y-4">
      <!-- 常用日語 -->
      <button 
        @click="router.push('/assistant/phrases')"
        class="w-full glass p-6 rounded-[2.5rem] border border-white flex items-center justify-between group transition-all active:scale-[0.98]"
      >
        <div class="flex items-center space-x-6">
          <div class="w-16 h-16 rounded-3xl bg-blue-50 text-blue-400 flex items-center justify-center group-hover:bg-blue-400 group-hover:text-white transition-colors duration-300 shadow-sm">
            <MessageSquare :size="32" />
          </div>
          <div class="text-left">
            <h3 class="text-xl font-black text-slate-900 tracking-tight mb-1">常用日語</h3>
            <p class="text-xs font-bold text-slate-400">Japanese Phrases</p>
          </div>
        </div>
        <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform">
          <ChevronRight :size="20" />
        </div>
      </button>

      <!-- 我的憑證 -->
      <button 
        @click="router.push('/assistant/vouchers')"
        class="w-full glass p-6 rounded-[2.5rem] border border-white flex items-center justify-between group transition-all active:scale-[0.98]"
      >
        <div class="flex items-center space-x-6">
          <div class="w-16 h-16 rounded-3xl bg-pink-50 text-pink-400 flex items-center justify-center group-hover:bg-pink-400 group-hover:text-white transition-colors duration-300 shadow-sm">
            <QrCode :size="32" />
          </div>
          <div class="text-left">
            <h3 class="text-xl font-black text-slate-900 tracking-tight mb-1">我的憑證</h3>
            <p class="text-xs font-bold text-slate-400">My Vouchers</p>
          </div>
        </div>
        <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform">
          <ChevronRight :size="20" />
        </div>
      </button>

      <!-- 檔案下載 -->
      <button 
        @click="router.push('/assistant/downloads')"
        class="w-full glass p-6 rounded-[2.5rem] border border-white flex items-center justify-between group transition-all active:scale-[0.98]"
      >
        <div class="flex items-center space-x-6">
          <div class="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-white transition-colors duration-300 shadow-sm">
            <Download :size="32" />
          </div>
          <div class="text-left">
            <h3 class="text-xl font-black text-slate-900 tracking-tight mb-1">檔案下載</h3>
            <p class="text-xs font-bold text-slate-400">Download & Backup</p>
          </div>
        </div>
        <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform">
          <ChevronRight :size="20" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
</style>
