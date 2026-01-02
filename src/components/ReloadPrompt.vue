<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RefreshCw, X, WifiOff } from 'lucide-vue-next'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl z-[100] border border-white/10 animate-in slide-in-from-bottom-5 duration-300"
    role="alert"
  >
    <div class="flex items-start space-x-4">
      <div class="p-2 bg-ice-blue/20 rounded-xl text-ice-blue">
        <RefreshCw v-if="needRefresh" :size="24" class="animate-spin-slow" />
        <WifiOff v-else :size="24" />
      </div>
      
      <div class="flex-1 pt-0.5">
        <h3 class="font-bold text-sm mb-1">
          {{ needRefresh ? '發現新版本' : '離線模式已就緒' }}
        </h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          {{ needRefresh 
            ? '新的內容已下載完成，點擊更新以載入最新版本。' 
            : '應用程式已快取完成，現在可以在沒有網路的情況下使用了。' 
          }}
        </p>
      </div>

      <button 
        @click="close"
        class="text-slate-400 hover:text-white transition-colors"
      >
        <X :size="20" />
      </button>
    </div>

    <div class="mt-4 flex space-x-3" v-if="needRefresh">
      <button
        @click="updateServiceWorker()"
        class="flex-1 py-2.5 bg-ice-blue text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
      >
        立即更新
      </button>
      <button
        @click="close"
        class="px-4 py-2.5 bg-white/10 text-slate-300 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors"
      >
        稍後
      </button>
    </div>
    <div class="mt-4" v-else>
       <button
        @click="close"
        class="w-full py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-colors"
      >
        我知道了
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
