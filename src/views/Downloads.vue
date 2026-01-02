<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, FileDown, Database, Upload, Download, Check, AlertCircle } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import { useItineraryStore } from '../stores/itinerary'
import { useExpenseStore } from '../stores/expense'
import { useVoucherStore } from '../stores/voucher'

const router = useRouter()
const itineraryStore = useItineraryStore()
const expenseStore = useExpenseStore()
const voucherStore = useVoucherStore()

const isGeneratingPdf = ref(false)
const isExportingJson = ref(false)
const importFile = ref(null)
const importStatus = ref(null) // 'success' | 'error' | null

// PDF Generation
const generatePdf = async () => {
  isGeneratingPdf.value = true
  const element = document.getElementById('pdf-content')
  
  const opt = {
    margin: 0,
    filename: `Tokyo_Trip_Memories_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  try {
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('PDF Generation Error:', error)
    alert('PDF 生成失敗，請稍後再試')
  } finally {
    isGeneratingPdf.value = false
  }
}

// JSON Export
const exportBackup = () => {
  isExportingJson.value = true
  try {
    const data = {
      timestamp: new Date().toISOString(),
      itinerary: itineraryStore.days,
      expenses: expenseStore.expenses,
      vouchers: voucherStore.vouchers,
      appVersion: '1.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Japan_Tokyo_Backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export Error:', error)
    alert('備份失敗')
  } finally {
    isExportingJson.value = false
  }
}

// JSON Import
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // Basic Validation
      if (!data.itinerary || !data.expenses || !data.vouchers) {
        throw new Error('Invalid Backup File')
      }

      // Restore Data
      // Note: This replaces current data. You might want to confirm first.
      if (confirm('確定要還原此備份嗎？目前的資料將會被覆蓋。')) {
        // Pinia store state replacement - might need direct state access or actions
        // Here we assume direct assignment works for simplicity if stores allow, 
        // otherwise we might need to reset and push. 
        // Best practice: Store actions for full restore.
        // For now, let's try direct state mutation if Setup Stores are used or Options API state.
        // If these are Setup Stores using ref(), we can assign .value (if exposed) or use $patch.
        
        // Using $patch for safety
        itineraryStore.$patch({ days: data.itinerary })
        expenseStore.$patch({ expenses: data.expenses })
        voucherStore.$patch({ vouchers: data.vouchers })
        
        importStatus.value = 'success'
        setTimeout(() => importStatus.value = null, 3000)
      }
    } catch (error) {
      console.error('Import Error:', error)
      importStatus.value = 'error'
      setTimeout(() => importStatus.value = null, 3000)
    }
  }
  reader.readAsText(file)
  event.target.value = '' // Reset input
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <!-- Header -->
    <header class="flex items-center px-2 py-2">
      <button @click="router.back()" class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all">
          <ChevronLeft :size="20" />
      </button>
      <h1 class="text-xl font-black text-slate-900 tracking-tight ml-2">檔案下載與備份</h1>
    </header>

    <div class="space-y-4 px-2">
      <!-- PDF 回憶錄 -->
      <section class="glass p-6 rounded-[2.5rem] border border-white shadow-sm">
        <div class="flex items-start space-x-4 mb-4">
          <div class="p-3 bg-red-50 text-red-500 rounded-2xl">
            <FileDown :size="24" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900">旅遊回憶錄 (PDF)</h3>
            <p class="text-xs text-slate-500 mt-1">將您的行程表與消費分析製作成精美的 PDF 報告，適合收藏或分享。</p>
          </div>
        </div>
        <button 
          @click="generatePdf"
          :disabled="true"
          class="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
        >
          <!-- {{ isGeneratingPdf ? '正在生成回憶錄...' : '下載 PDF 回憶錄' }} -->
            功能開發中...
        </button>
      </section>

      <!-- 資料備份 -->
      <section class="glass p-6 rounded-[2.5rem] border border-white shadow-sm">
        <div class="flex items-start space-x-4 mb-4">
          <div class="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Database :size="24" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900">資料備份與還原</h3>
            <p class="text-xs text-slate-500 mt-1">匯出完整的 App 資料 (JSON)，或還原之前的備份。</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="exportBackup"
            :disabled="isExportingJson"
            class="py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors"
          >
            <Download :size="16" />
            <span>匯出備份</span>
          </button>
          
          <button 
            @click="triggerFileInput"
            class="py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors"
          >
            <Upload :size="16" />
            <span>還原備份</span>
          </button>
          <input 
            id="file-upload" 
            type="file" 
            accept=".json" 
            class="hidden" 
            @change="handleFileUpload"
          />
        </div>

        <!-- Import Status Message -->
        <div v-if="importStatus" class="mt-4 p-3 rounded-xl flex items-center space-x-2 text-xs font-bold" :class="importStatus === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'">
          <component :is="importStatus === 'success' ? Check : AlertCircle" :size="16" />
          <span>{{ importStatus === 'success' ? '資料還原成功！' : '資料格式錯誤或還原失敗' }}</span>
        </div>
      </section>
    </div>

    <!-- Hidden PDF Content to be rendered -->
    <div class="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none" id="pdf-wrapper">
      <!-- A4 Size: 210mm x 297mm -->
      <div id="pdf-content" class="bg-white text-slate-900 font-sans" style="width: 210mm; padding: 0;">
        <!-- Cover Page -->
        <!-- <div class="h-[296mm] flex flex-col justify-center items-center text-center relative overflow-hidden bg-slate-50 page-break-after">
           <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ice-blue via-pink-400 to-yellow-300"></div>
           <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
           <div class="absolute bottom-20 left-20 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

           <h1 class="text-6xl font-black mb-4 tracking-tighter text-slate-900 z-10">TOKYO<br/>TRIP</h1>
           <p class="text-xl text-slate-500 font-medium tracking-[0.5em] uppercase mb-12 z-10">Memories & Expenses</p>
           
           <div class="px-10 py-4 border-2 border-slate-900 rounded-full z-10">
             <p class="text-2xl font-bold font-mono">{{ new Date().toLocaleDateString() }}</p>
           </div>

           <div class="absolute bottom-10 text-xs font-bold text-slate-300 tracking-widest uppercase">
             Generated by Travel Assistant
           </div>
        </div> -->

        <!-- Content Padding Container -->
        <!-- <div class="p-[15mm]">
          <div class="mb-10">
            <h2 class="text-3xl font-black border-l-8 border-ice-blue pl-6 mb-8 text-slate-800">行程總覽</h2>
            <div class="space-y-6">
              <div 
                v-for="day in itineraryStore.days" 
                :key="day.id" 
                class="break-inside-avoid mb-6"
              >
                 <div class="flex items-baseline space-x-3 mb-3 border-b border-slate-200 pb-2">
                   <span class="text-2xl font-black text-slate-300">0{{ day.id }}</span>
                   <h3 class="text-lg font-bold text-slate-900">{{ day.date }}</h3>
                 </div>
                 
                 <div class="bg-slate-50 rounded-2xl p-4">
                   <ul class="space-y-3">
                     <li v-for="item in day.schedule" :key="item.time" class="flex space-x-4 text-sm">
                       <span class="font-mono font-bold text-slate-400 w-14 shrink-0">{{ item.time }}</span>
                       <div class="flex-1">
                         <span class="font-bold text-slate-800 block">{{ item.activity }}</span>
                         <span v-if="item.location" class="text-xs text-slate-500 block mt-0.5">@ {{ item.location }}</span>
                       </div>
                     </li>
                   </ul>
                 </div>
              </div>
            </div>
          </div>

          <div class="page-break-before pt-10">
            <h2 class="text-3xl font-black border-l-8 border-pink-400 pl-6 mb-8 text-slate-800">消費支出報告</h2>
            
            <div class="bg-slate-900 text-white p-8 rounded-[2rem] mb-10 shadow-xl break-inside-avoid">
               <p class="text-sm text-slate-400 font-bold uppercase tracking-widest mb-2">總支出 (Total Estimate)</p>
               <div class="flex items-baseline space-x-2">
                 <span class="text-xl">¥</span>
                 <p class="text-6xl font-black tracking-tighter">{{ expenseStore.totalSpent.toLocaleString() }}</p>
               </div>
               <p class="text-xl font-bold text-ice-blue mt-2">≈ TWD {{ parseFloat(expenseStore.totalSpentTWD).toLocaleString() }}</p>
            </div>
             
            <div class="grid grid-cols-2 gap-x-8 gap-y-6">
               <div 
                 v-for="(cat, idx) in ['餐飲', '交通', '購物', '娛樂', '其他']" 
                 :key="cat" 
                 class="break-inside-avoid border-b border-slate-100 pb-2"
               >
                 <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ cat }}</p>
                 <p class="text-2xl font-black text-slate-800">
                   ¥ {{ expenseStore.expenses.filter(e => e.category === cat).reduce((sum, i) => sum + i.amount, 0).toLocaleString() }}
                 </p>
               </div>
             </div>
          </div>
        </div> -->

      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
.page-break-after {
  page-break-after: always;
}
.page-break-before {
  page-break-before: always;
}
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
