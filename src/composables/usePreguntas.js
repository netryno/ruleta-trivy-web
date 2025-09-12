/*
Carga el JSON y devuelve una pregunta aleatoria.
Si falla devuelve null y un mensaje.
*/
import { ref } from 'vue'
const lista = ref([])
const error = ref('')
export async function cargarPreguntas() {
try {
const res = await fetch('/preguntas.json')
if (!res.ok) throw new Error('No se pudo cargar el JSON')
const data = await res.json()
if (!Array.isArray(data) || !data.length) throw new Error('JSON vacío')
lista.value = data
error.value = ''
} catch (e) {
error.value = e.message
lista.value = []
}
}
export function obtenerPreguntaRandom() {
if (!lista.value.length) return null
const idx = Math.floor(Math.random() * lista.value.length)
return lista.value[idx]
}
export { error }
