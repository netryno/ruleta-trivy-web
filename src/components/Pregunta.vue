<template>
  <div class="card">
    <img class="logo-fiscalia" src="/img/fiscalia.png" alt="Fiscalía General de la Nación" />
    <h2>{{ pregunta.titulo }}</h2>

    <ul class="opciones">
      <li
        v-for="(r, i) in pregunta.respuestas"
        :key="i"
        :class="{
          /*correcta: mostrar && r.correcta,*/
          correcta: mostrar && seleccionada?.correcta && r.correcta, // solo si acertó
          incorrecta: mostrar && seleccionada === r && !r.correcta
        }"
        @click="seleccionar(r)"
      >
        {{ r.texto }}
      </li>
    </ul>

    <div v-if="mostrar" class="feedback">
      <p :class="{'res-ok': esCorrecta, 'res-ko': !esCorrecta}">
        {{ esCorrecta ? '¡Correcto!' : 'Incorrecto' }}
      </p>
      <button @click="$emit('reiniciar')">Volver a jugar</button>
    </div>

    <Confetti ref="confettiRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Confetti from './Confetti.vue'

const props = defineProps({
  pregunta: { type: Object, required: true }
})

const emit = defineEmits(['reiniciar'])

const confettiRef = ref(null)
const seleccionada = ref(null)
const mostrar = ref(false)
const esCorrecta = ref(false)

function seleccionar(respuesta) {
  if (mostrar.value) return
  seleccionada.value = respuesta
  esCorrecta.value = respuesta.correcta
  mostrar.value = true
  if (esCorrecta.value) confettiRef.value.lanzar()
}
</script>

<style scoped>
.res-ok{
    color: #20ff00;
    text-shadow: 2px 2px 5px #72ff43;
}
.res-ko{
  color: red;
  text-shadow: 2px 2px 5px #ff4393;
}
.opciones {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.opciones li {
  /*background: #ffffff1a;*/
  background: linear-gradient(0deg, #7bc9c3, #3a8e88, #7bc9c3);
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
/*
.opciones li:hover {
  background: #ffffff33;
}
*/
.opciones li.correcta {
  /*background: #2ecc71;*/
  background: linear-gradient(0deg, #8cf9ba, #2ecc71, #8cf9ba);
  color: #000;
  pointer-events: none;
}
.opciones li.incorrecta {
  /*background: #e74c3c;*/
  background: linear-gradient(0deg, #ffaea5, #e74c3c, #ffaea5);
  color: #fff;
  pointer-events: none;
}
.feedback {
  margin-top: 1rem;
}
.feedback p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.feedback p.ok {
  color: #2ecc71;
}
.logo-fiscalia{
    width: 250px;
    margin-bottom: 3rem;
}
</style>