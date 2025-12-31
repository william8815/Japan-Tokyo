<script setup>
import { onMounted, onUnmounted } from 'vue'

const snowflakes = []
let animationFrameId = null

const createSnowflake = () => {
  const snowflake = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 1 + 0.5,
    opacity: Math.random() * 0.5 + 0.3,
    wind: Math.random() * 1 - 0.5
  }
  return snowflake
}

const updateSnow = (ctx) => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  // 將雪花顏色改為淡淡的冰藍色，確保在全白背景下也能看見
  ctx.fillStyle = 'rgba(186, 230, 253, 0.6)' 
  
  snowflakes.forEach((s) => {

    s.y += s.speed
    s.x += s.wind
    
    if (s.y > window.innerHeight) {
      s.y = -10
      s.x = Math.random() * window.innerWidth
    }
    
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
    ctx.fill()
  })
  
  animationFrameId = requestAnimationFrame(() => updateSnow(ctx))
}

onMounted(() => {
  const canvas = document.getElementById('snow-canvas')
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  for (let i = 0; i < 50; i++) {
    snowflakes.push(createSnowflake())
  }
  
  updateSnow(ctx)
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <canvas id="snow-canvas" class="fixed inset-0 pointer-events-none z-0"></canvas>
</template>

<style scoped>
#snow-canvas {
  filter: blur(1px);
}
</style>
