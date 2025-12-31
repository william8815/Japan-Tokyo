<script setup>
import { ref } from 'vue'
import { Phone, Languages, User, Info, ChevronDown, ExternalLink } from 'lucide-vue-next'

const categories = ref([
  {
    id: 'emergency',
    name: '緊急聯絡',
    icon: Phone,
    items: [
      { title: '報警 (Police)', phone: '110', desc: '遇到事故或犯罪時撥打' },
      { title: '救護車/火警 (Ambulance)', phone: '119', desc: '急救或火災時撥打' },
      { title: '台北駐日經濟文化代表處', phone: '03-3280-7811', desc: '護照遺失或急難救助' }
    ]
  },
  {
    id: 'phrases',
    name: '常用日語',
    icon: Languages,
    items: [
      { jp: 'すみません', romaji: 'Sumimasen', tw: '不好意思 / 請問...', type: 'common' },
      { jp: 'お会計をお願いします', romaji: 'Okaikei o onegaishimasu', tw: '請幫我結帳', type: 'food' },
      { jp: 'これをください', romaji: 'Kore o kudasai', tw: '我要買這個', type: 'shop' },
      { jp: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', tw: '廁所在哪裡？', type: 'common' },
      { jp: '免税（めんぜい）できますか？', romaji: 'Menzei dekimasu ka?', tw: '可以免稅嗎？', type: 'shop' }
    ]
  }
])

const expanded = ref('emergency')

const toggle = (id) => {
  expanded.value = expanded.value === id ? null : id
}
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">旅遊助手</h1>
      <p class="text-slate-500 font-medium">翻譯與緊急資訊</p>
    </header>

    <div class="space-y-4">
      <div v-for="cat in categories" :key="cat.id" class="space-y-3">
        <button 
          @click="toggle(cat.id)"
          class="w-full flex justify-between items-center p-6 glass rounded-3xl border border-white shadow-sm ring-1 ring-slate-100/50"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-50 text-ice-blue rounded-xl">
              <component :is="cat.icon" :size="20" />
            </div>
            <span class="font-black text-slate-800 tracking-wide">{{ cat.name }}</span>
          </div>
          <ChevronDown 
            :size="20" 
            class="text-slate-300 transition-transform duration-300"
            :class="{ 'rotate-180': expanded === cat.id }"
          />
        </button>

        <transition name="expand">
          <div v-if="expanded === cat.id" class="space-y-3 px-1">
            <div 
              v-for="(item, idx) in cat.items" 
              :key="idx"
              class="bg-white/50 backdrop-blur-sm p-5 rounded-3xl border border-white shadow-xs group"
            >
              <div v-if="cat.id === 'emergency'" class="flex justify-between items-center">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm">{{ item.title }}</h4>
                  <p class="text-xs text-slate-400 font-bold mt-1">{{ item.desc }}</p>
                </div>
                <a :href="`tel:${item.phone.replace(/-/g, '')}`" class="p-3 bg-blue-50 text-blue-500 rounded-2xl hover:bg-blue-100 transition-colors">
                  <Phone :size="18" stroke-width="2.5" />
                </a>
              </div>
              
              <div v-else class="flex justify-between items-start">
                <div class="space-y-1">
                  <p class="text-lg font-black text-slate-900 leading-tight">{{ item.jp }}</p>
                  <p class="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">{{ item.romaji }}</p>
                  <p class="text-sm font-bold text-blue-500 pt-1">{{ item.tw }}</p>
                </div>
                <button class="p-2 text-slate-100 hover:text-ice-blue transition-colors">
                  <Info :size="16" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 個人資訊卡片 (Bonus) -->
    <section class="glass p-6 rounded-[2rem] border border-white mt-8">
      <div class="flex items-center space-x-4 mb-4">
        <div class="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
          <User :size="24" />
        </div>
        <div>
          <h3 class="font-black text-slate-900">個人重要資訊</h3>
          <p class="text-xs text-slate-400 font-bold uppercase">Emergency Profile</p>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between p-3 bg-slate-50/50 rounded-xl">
          <span class="text-xs font-bold text-slate-400">飯店地址</span>
          <span class="text-xs font-bold text-slate-700">池袋車站附近 (東口)</span>
        </div>
        <div class="flex justify-between p-3 bg-slate-50/50 rounded-xl">
          <span class="text-xs font-bold text-slate-400">保險單號</span>
          <span class="text-xs font-bold text-slate-700">TW-123456789</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 800px;
}
</style>
