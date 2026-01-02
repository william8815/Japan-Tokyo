<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Utensils, ShoppingBag, Train, Check, ChevronDown, ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
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
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <header class="flex items-center px-2 py-2">
      <button @click="router.back()" class="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all">
          <ChevronLeft :size="20" />
      </button>
      <h1 class="text-xl font-black text-slate-900 tracking-tight ml-2">常用日語</h1>
    </header>

    <!-- Content -->
    <div class="space-y-4 animate-in fade-in duration-500">
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
