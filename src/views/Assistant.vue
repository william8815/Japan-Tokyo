<script setup>
import { ref } from 'vue'
import { 
  MessageSquare, BookOpen, Train, Utensils, ShoppingBag, 
  MapPin, HelpCircle, ChevronDown, Check, QrCode, Image as ImageIcon, Plus, Trash2 
} from 'lucide-vue-next'

const activeTab = ref('phrases')
const expandedSection = ref('restaurant')

const phrases = {
  restaurant: {
    title: '餐廳與點餐',
    icon: Utensils,
    items: [
      { jp: 'すみません', ro: 'Sumimasen', cn: '不好意思 (呼叫服務生)' },
      { jp: 'これをください', ro: 'Kore o kudasai', cn: '請給我這個' },
      { jp: 'お会計をお願いします', ro: 'O-kaikei o onegaishimasu', cn: '請結帳' },
      { jp: 'クレジットカードは使えますか？', ro: 'Kurejitto kādo wa tsukaemasu ka?', cn: '可以使用信用卡嗎？' }
    ]
  },
  shopping: {
    title: '購物與免稅',
    icon: ShoppingBag,
    items: [
      { jp: 'いくらですか？', ro: 'Ikura desu ka?', cn: '多少錢？' },
      { jp: '免稅できますか？', ro: 'Menzei dekimasu ka?', cn: '可以免稅嗎？' },
      { jp: '袋をください', ro: 'Fukuro o kudasai', cn: '請給我袋子' }
    ]
  },
  transport: {
    title: '交通與問路',
    icon: Train,
    items: [
      { jp: 'ここはどこですか？', ro: 'Koko wa doko desu ka?', cn: '這裡是哪裡？' },
      { jp: '〜駅はどこですか？', ro: '~Eki wa doko desu ka?', cn: '～車站在哪裡？' }
    ]
  }
}

// 憑證部分邏輯
const storeVouchers = ref(JSON.parse(localStorage.getItem('vouchers') || '[]'))
const handleUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (res) => {
    storeVouchers.value.push({
      id: Date.now(),
      title: '新憑證',
      url: res.target.result
    })
    saveVouchers()
  }
  reader.readAsDataURL(file)
}
const deleteVoucher = (id) => {
  storeVouchers.value = storeVouchers.value.filter(v => v.id !== id)
  saveVouchers()
}
const saveVouchers = () => {
  localStorage.setItem('vouchers', JSON.stringify(storeVouchers.value))
}
</script>

<template>
  <div class="space-y-6">
    <header class="px-2">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">旅遊工具箱</h1>
      <p class="text-slate-500 font-medium">短語助手與數位憑證</p>
    </header>

    <!-- 分頁切換 -->
    <div class="bg-white p-2 rounded-[2rem] border border-slate-100 flex shadow-sm">
      <button 
        @click="activeTab = 'phrases'"
        :class="['flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all', activeTab === 'phrases' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400']"
      >
        常用日語
      </button>
      <button 
        @click="activeTab = 'vouchers'"
        :class="['flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all', activeTab === 'vouchers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400']"
      >
        我的憑證
      </button>
    </div>

    <!-- 內容區：日語短語 -->
    <div v-if="activeTab === 'phrases'" class="space-y-4 animate-in fade-in duration-500">
      <div v-for="(section, key) in phrases" :key="key" class="glass rounded-[2.5rem] border border-white overflow-hidden shadow-sm">
        <button 
          @click="expandedSection = key"
          class="w-full flex items-center justify-between p-6 transition-colors"
          :class="expandedSection === key ? 'bg-ice-blue/5' : ''"
        >
          <div class="flex items-center space-x-4">
            <div :class="['p-3 rounded-2xl', expandedSection === key ? 'bg-ice-blue text-white' : 'bg-slate-50 text-slate-400']">
              <component :is="section.icon" :size="20" />
            </div>
            <span class="font-black text-slate-800 tracking-tight">{{ section.title }}</span>
          </div>
          <ChevronDown :size="18" :class="['text-slate-300 transition-transform', expandedSection === key ? 'rotate-180' : '']" />
        </button>

        <transition name="expand">
          <div v-if="expandedSection === key" class="p-6 pt-0 space-y-5">
            <div v-for="(item, idx) in section.items" :key="idx" class="group bg-white p-5 rounded-3xl border border-slate-50 relative active:scale-[0.98] transition-all">
              <p class="text-lg font-black text-slate-900 leading-tight mb-1">{{ item.jp }}</p>
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[10px] font-black text-ice-blue uppercase tracking-widest">{{ item.ro }}</p>
                  <p class="text-xs font-medium text-slate-500 mt-2">{{ item.cn }}</p>
                </div>
                <div class="p-2 bg-slate-50 rounded-xl text-slate-300">
                  <Check :size="14" />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 內容區：數位憑證 -->
    <div v-if="activeTab === 'vouchers'" class="space-y-6 animate-in fade-in duration-500 px-1">
      <div class="grid grid-cols-2 gap-4">
        <!-- 上傳按鈕 -->
        <label class="aspect-[3/4] glass rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3 cursor-pointer hover:border-ice-blue hover:bg-blue-50/30 transition-all group">
          <input type="file" @change="handleUpload" accept="image/*" class="hidden" />
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 group-hover:text-ice-blue transition-colors">
            <Plus :size="24" />
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">新增憑證圖片</span>
        </label>

        <!-- 憑證卡片 -->
        <div v-for="v in storeVouchers" :key="v.id" class="aspect-[3/4] relative group rounded-[2.5rem] overflow-hidden shadow-sm border border-white">
          <img :src="v.url" class="w-full h-full object-cover" />
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-10">
            <p class="text-white text-xs font-black truncate">{{ v.title }}</p>
          </div>
          <button 
            @click="deleteVoucher(v.id)"
            class="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div class="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex items-center space-x-4">
        <QrCode :size="32" class="text-slate-300" />
        <p class="text-xs font-bold text-slate-400 leading-relaxed">提示：上傳 Skyliner 或 Shibuya Sky 的 QR Code 截圖，方便在日本當地快速掃描進站。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
}
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 1000px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
