<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { Calendar, CreditCard, CloudSun, QrCode, HelpingHand } from 'lucide-vue-next'
import SnowEffect from './components/SnowEffect.vue'
</script>

<template>
  <div class="min-h-screen relative overflow-x-hidden bg-slate-50">
    <!-- 落雪背景動畫組件 -->
    <SnowEffect />
    
    <!-- 主要內容區 -->
    <main class="relative pb-24 pt-6 px-4 max-w-md mx-auto z-10 transition-all duration-500">

      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- 底部導覽列 -->
    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass rounded-3xl py-3 px-6 shadow-xl z-50">
      <div class="flex justify-between items-center">
        <RouterLink to="/" class="nav-item" active-class="text-ice-blue">
          <CloudSun :size="24" />
        </RouterLink>
        <RouterLink to="/itinerary" class="nav-item" active-class="text-ice-blue">
          <Calendar :size="24" />
        </RouterLink>
        <RouterLink to="/expense" class="nav-item" active-class="text-ice-blue">
          <CreditCard :size="24" />
        </RouterLink>
        <RouterLink to="/vouchers" class="nav-item" active-class="text-ice-blue">
          <QrCode :size="24" />
        </RouterLink>
        <RouterLink to="/assistant" class="nav-item" active-class="text-ice-blue">
          <HelpingHand :size="24" />
        </RouterLink>
      </div>
    </nav>

  </div>
</template>

<style scoped>
.nav-item {
  @apply text-slate-400 transition-colors duration-300;
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
