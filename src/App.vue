<script setup>
import { onMounted, ref } from 'vue'
import Ruleta from './components/Ruleta.vue'
import Pregunta from './components/Pregunta.vue'
import { cargarPreguntas, obtenerPreguntaRandom, error } from './composables/usePreguntas.js'

const etapa = ref('ruleta') // ruleta | pregunta
const preguntaActual = ref(null)

onMounted(async () => {
  await cargarPreguntas()
})

function alSeleccionCategoria() {
  if (error.value) return alert(error.value)
  preguntaActual.value = obtenerPreguntaRandom()
  if (!preguntaActual.value) return alert('No hay preguntas')
  etapa.value = 'pregunta'
}

function reiniciar() {
  etapa.value = 'ruleta'
  preguntaActual.value = null
}
</script>
<template>
  <Ruleta v-if="etapa === 'ruleta'" @seleccion="alSeleccionCategoria" />
  <Pregunta v-else-if="etapa === 'pregunta'" :pregunta="preguntaActual" @reiniciar="reiniciar" />
</template>
