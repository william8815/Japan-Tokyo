<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { Calendar, CreditCard, Home, QrCode, HelpingHand } from 'lucide-vue-next'
import SnowEffect from './components/SnowEffect.vue'
</script>

<template>
  <div class="h-screen relative overflow-x-hidden bg-slate-50">
    <!-- 落雪背景動畫組件 -->
    <SnowEffect />
    
    <!-- 主要內容區 -->
    <main class="pb-24 pt-6 px-4 max-w-md mx-auto z-10 transition-all duration-500">

      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- 底部導覽列 -->
    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-sm glass rounded-3xl p-1.5 shadow-xl z-50">
      <div class="flex justify-between items-center bg-white/20 rounded-2xl p-1 gap-1">
        <RouterLink to="/" class="nav-link" active-class="active-nav" title="今日">
          <Home :size="20" />
        </RouterLink>
        <RouterLink to="/itinerary" class="nav-link" active-class="active-nav" title="行程">
          <Calendar :size="20" />
        </RouterLink>
        <RouterLink to="/expense" class="nav-link" active-class="active-nav" title="消費">
          <CreditCard :size="20" />
        </RouterLink>
        <RouterLink to="/assistant" class="nav-link" active-class="active-nav" title="助手/憑證">
          <HelpingHand :size="20" />
        </RouterLink>
      </div>
    </nav>




  </div>
</template>

<style scoped>
.nav-link {
  @apply flex-1 flex items-center justify-center py-3 rounded-xl text-slate-400 transition-all duration-200;
}
.active-nav {
  @apply bg-ice-blue text-white shadow-md scale-[1.02];
}
.glass {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
