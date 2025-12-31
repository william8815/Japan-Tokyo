<script setup>
import { ref, onMounted } from 'vue'
import { Plus, QrCode, Ticket, ExternalLink, Image as ImageIcon, Trash2 } from 'lucide-vue-next'

const vouchers = ref([])

onMounted(() => {
  const saved = localStorage.getItem('tokyo-vouchers')
  if (saved) vouchers.value = JSON.parse(saved)
  else {
    // 預設範例
    vouchers.value = [
      { id: 1, title: 'Skyliner 兌換券', type: 'ticket', image: null, desc: '成田機場取票' },
      { id: 2, title: 'Shibuya Sky 門票', type: 'qr', image: null, desc: '1/21 18:00 入場' }
    ]
  }
})

const save = () => {
  localStorage.setItem('tokyo-vouchers', JSON.stringify(vouchers.value))
}

const addVoucher = () => {
  vouchers.value.unshift({
    id: Date.now(),
    title: '新憑證',
    type: 'ticket',
    image: null,
    desc: '點擊編輯描述'
  })
  save()
}

const deleteVoucher = (id) => {
  vouchers.value = vouchers.value.filter(v => v.id !== id)
  save()
}

const handleFileUpload = (event, id) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const v = vouchers.value.find(item => item.id === id)
    if (v) v.image = e.target.result
    save()
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">數位憑證</h1>
        <p class="text-slate-500 font-medium">門票、QR Code 一手掌握</p>
      </div>
      <button 
        @click="addVoucher"
        class="bg-ice-blue text-white p-4 rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus :size="24" />
      </button>
    </header>

    <div class="grid grid-cols-1 gap-4">
      <div 
        v-for="v in vouchers" 
        :key="v.id"
        class="glass rounded-[2rem] overflow-hidden border border-white shadow-sm ring-1 ring-slate-100/50 group animate-in zoom-in duration-300"
      >
        <!-- 圖片顯示區 -->
        <div class="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden">
          <img v-if="v.image" :src="v.image" class="w-full h-full object-cover" />
          <div v-else class="flex flex-col items-center text-slate-300">
            <ImageIcon :size="48" stroke-width="1" />
            <p class="text-xs font-bold mt-2 uppercase tracking-widest">尚未上傳圖片</p>
          </div>
          
          <!-- 上傳按鈕 -->
          <label class="absolute inset-0 cursor-pointer bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center group/btn">
            <input type="file" class="hidden" @change="e => handleFileUpload(e, v.id)" accept="image/*" />
            <div class="bg-white/90 backdrop-blur p-3 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity translate-y-2 group-hover/btn:translate-y-0 duration-300">
              <Plus :size="20" class="text-slate-900" />
            </div>
          </label>

          <div class="absolute top-4 left-4 flex space-x-2">
            <span class="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900 shadow-sm flex items-center space-x-1">
              <QrCode v-if="v.type === 'qr'" :size="10" />
              <Ticket v-else :size="10" />
              <span>{{ v.type }}</span>
            </span>
          </div>
        </div>

        <!-- 文字資訊區 -->
        <div class="p-5 flex justify-between items-center">
          <div>
            <input 
              v-model="v.title" 
              @blur="save"
              class="bg-transparent border-none p-0 text-lg font-black text-slate-800 focus:ring-0 w-full"
            />
            <input 
              v-model="v.desc" 
              @blur="save"
              class="bg-transparent border-none p-0 text-sm font-medium text-slate-400 focus:ring-0 w-full"
            />
          </div>
          
          <div class="flex items-center space-x-1">
            <button class="p-3 text-slate-200 hover:text-ice-blue transition-colors">
              <ExternalLink :size="20" />
            </button>
            <button @click="deleteVoucher(v.id)" class="p-3 text-slate-200 hover:text-red-400 transition-colors">
              <Trash2 :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示 -->
    <div class="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-start space-x-3 mt-6">
      <div class="p-2 bg-white rounded-xl text-blue-500 shadow-sm">
        <QrCode :size="16" />
      </div>
      <p class="text-xs text-blue-600/80 leading-relaxed font-medium">
        <b>提示：</b> 截圖你的門票、JR Pass 或旅宿 QR Code 並上傳，PWA 會將其快取在手機中，即使在地鐵內沒有網路也能隨時開啟出示。
      </p>
    </div>
  </div>
</template>
