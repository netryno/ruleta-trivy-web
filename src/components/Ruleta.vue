<template>
  <div class="card">
    <img class="logo-fiscalia" src="/img/fiscalia.png" alt="Fiscalía General de la Nación" />

    <h1 class="titulo">🎲🏆​ Gira y Gana  con la Fiscalía </h1>

    <!-- wrapper lets us overlay the centre-logo -->
    <div class="wheel-wrapper">
      <canvas ref="canvas" width="320" height="320"></canvas>
      <img class="centre-logo" src="/img/rueda-01.png" alt="centre" />
    </div>

    <div class="pie">
    <button ref="btnGirar" @click="girar" :disabled="isSpinning">
      {{ isSpinning ? 'Girando...' : 'GIRAR' }}
    </button>
    </div>  
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const emit = defineEmits(['seleccion'])

const canvas   = ref(null)
const isSpinning = ref(false)

/* ---------------  CONFIG  ---------------- */
const colores    = ['#ff595e','#ffca3a','#8ac926','#1982c4','#15b1c9ff','#ff924c']
const logos = [
  '/juegos/ruleta/img/logo1.png',
  '/juegos/ruleta/img/logo6.png',
  '/juegos/ruleta/img/logo7.png',
  '/juegos/ruleta/img/logo4.png',
  '/juegos/ruleta/img/logo5.png',
  '/juegos/ruleta/img/logo3.png'
]
const sliceCount = 6
/* ----------------------------------------- */

let ctx, centerX, centerY, radio, gradosFinales

/* ----------  DRAW STATIC WHEEL  ---------- */
function dibujarRuleta() {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')

  /* retina ready */
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.value.getBoundingClientRect()
  canvas.value.width  = rect.width  * dpr
  canvas.value.height = rect.height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  centerX = rect.width  / 2
  centerY = rect.height / 2
  radio   = Math.min(centerX, centerY) * .9

  const anguloSlice = (2 * Math.PI) / sliceCount

  /* slices */
  for (let i = 0; i < sliceCount; i++) {
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(i * anguloSlice)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, radio, 0, anguloSlice)
    ctx.closePath()
    ctx.fillStyle = colores[i % colores.length]
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth   = 4
    ctx.stroke()
    ctx.restore()
  }

  /* outer border */
  ctx.beginPath()
  ctx.arc(centerX, centerY, radio, 0, 2 * Math.PI)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth   = 8
  ctx.stroke()

  /* inner logos (simple centred draw) */
  for (let i = 0; i < sliceCount; i++) {
    const img     = new Image()
    img.src       = logos[i % logos.length]
    img.onload = () => {
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(i * anguloSlice + anguloSlice / 2)
    /*
      const logoSize = 32
      ctx.drawImage(
        img,
        radio * 0.55 - logoSize / 2,
        -logoSize / 2,
        logoSize,
        logoSize
      )
      */
        const logoW = 54;   // px ancho
        const logoH = 32;   // px alto
        ctx.drawImage(
        img,
        radio * 0.55 - logoW / 2, // misma distancia radial
        -logoH / 2,               // centrado vertical
        logoW,
        logoH
        );


      ctx.restore()
    }
  }

  /* static arrow (top) */
  /*
  ctx.beginPath()
  ctx.moveTo(centerX - 18, 20)
  ctx.lineTo(centerX + 18, 20)
  ctx.lineTo(centerX, 0)
  ctx.closePath()
  ctx.fillStyle = '#fff'
  ctx.fill()
  */
}

/* ---------------  SPIN  ------------------ */
function girar() {
  if (isSpinning.value) return
  isSpinning.value = true

  const vueltas = 6 + Math.floor(Math.random() * 4) // 6-9
  gradosFinales = vueltas * 360 + Math.floor(Math.random() * 360)

  const duracion = 4000 // ms
  canvas.value.style.transition = `transform ${duracion}ms cubic-bezier(0.22, 1, 0.36, 1)`
  canvas.value.style.transform  = `rotate(${gradosFinales}deg)`

  setTimeout(() => {
    isSpinning.value = false
    const normalizado = (360 - (gradosFinales % 360)) % 360
    const sliceAngle  = 360 / sliceCount
    const indice      = Math.floor(normalizado / sliceAngle)
    emit('seleccion', indice)
  }, duracion)
}

/* ---------------  LIFE  ------------------ */
onMounted(() => {
  dibujarRuleta()
  window.addEventListener('resize', dibujarRuleta)
})
watch(canvas, dibujarRuleta)
</script>

<style scoped>
.wheel-wrapper {
  position: relative;
  display: inline-block;
}
canvas {
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 50%;
  box-shadow: 0 8px 25px rgba(0,0,0,.35);
}
.centre-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 64px;
  height: 64px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.titulo { margin-bottom: 1rem; }
button  { margin-top: 1.5rem; }
.logo-fiscalia{
    width: 250px;
    margin-bottom: 3rem;
}
.pie{
    margin-top: 1rem;
    display: block
}
</style>