<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CheckCircle2, Clock3, XCircle, RefreshCw, ShoppingBag } from 'lucide-vue-next'

import { orderService } from '@/services/order.service'
import type { Order } from '@/types/order.types'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const errorMessage = ref('')

const returnStatus = computed(() => String(route.query.estado ?? ''))

const resultTitle = computed(() => {
  if (order.value?.status === 'PAID') return '¡Pago confirmado!'
  if (order.value?.status === 'EXPIRED') return 'Orden expirada'
  if (order.value?.status === 'PENDING') return 'Pago pendiente'
  if (returnStatus.value === 'failure') return 'El pago no fue completado'
  return 'Resultado del pago'
})

const resultDescription = computed(() => {
  if (order.value?.status === 'PAID') {
    return 'El backend ha confirmado que el pago de tu compra fue aprobado.'
  }

  if (order.value?.status === 'EXPIRED') {
    return 'El plazo para completar el pago de esta orden ha finalizado.'
  }

  if (order.value?.status === 'PENDING') {
    return 'Todavía no tenemos confirmación del pago. Puede tardar unos momentos en actualizarse.'
  }

  if (returnStatus.value === 'failure') {
    return 'Mercado Pago informó que el proceso de pago no se completó.'
  }

  return 'Consulta el estado de tu compra en el detalle de la orden.'
})

const resultIcon = computed(() => {
  if (order.value?.status === 'PAID') return CheckCircle2
  if (order.value?.status === 'EXPIRED' || returnStatus.value === 'failure') {
    return XCircle
  }

  return Clock3
})

const resultClasses = computed(() => {
  if (order.value?.status === 'PAID') {
    return 'bg-green-50 text-green-700'
  }

  if (order.value?.status === 'EXPIRED' || returnStatus.value === 'failure') {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-amber-50 text-amber-700'
})

async function loadOrder() {
  const orderId = String(route.query.orden ?? '')

  if (!orderId) {
    errorMessage.value = 'No se recibió el identificador de la orden.'
    loading.value = false
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    order.value = await orderService.getById(orderId)
  } catch {
    errorMessage.value = 'No fue posible consultar el estado de tu orden.'
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)
</script>

<template>
  <section class="mx-auto flex max-w-3xl justify-center px-6 py-16">
    <div
      class="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
    >
      <div v-if="loading" class="flex flex-col items-center">
        <RefreshCw :size="36" class="animate-spin text-primary-600" />

        <h1 class="mt-5 text-xl font-bold text-slate-900">Verificando tu pago...</h1>

        <p class="mt-2 text-sm text-slate-500">Estamos consultando el estado de tu orden.</p>
      </div>

      <div v-else-if="errorMessage" class="flex flex-col items-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600"
        >
          <Clock3 :size="32" />
        </div>

        <h1 class="mt-5 text-xl font-bold text-slate-900">No pudimos verificar tu pago</h1>

        <p class="mt-2 text-sm text-slate-500">
          {{ errorMessage }}
        </p>

        <button
          v-if="route.query.orden"
          type="button"
          class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          @click="loadOrder"
        >
          <RefreshCw :size="15" />
          Intentar nuevamente
        </button>
      </div>

      <div v-else-if="order" class="flex flex-col items-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full" :class="resultClasses">
          <component :is="resultIcon" :size="34" />
        </div>

        <h1 class="mt-5 text-2xl font-bold text-slate-900">
          {{ resultTitle }}
        </h1>

        <p class="mt-2 max-w-lg text-sm leading-6 text-slate-500">
          {{ resultDescription }}
        </p>

        <div class="mt-8 w-full rounded-xl bg-slate-50 p-5 text-left">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ShoppingBag :size="17" />
            Resumen de la orden
          </div>

          <div class="mt-4 space-y-3">
            <div class="flex justify-between gap-4 text-sm">
              <span class="text-slate-500"> Orden </span>

              <span class="break-all text-right font-medium text-slate-800"> #{{ order.id }} </span>
            </div>

            <div class="flex justify-between gap-4 text-sm">
              <span class="text-slate-500"> Estado </span>

              <span class="font-semibold text-slate-800">
                {{ order.status }}
              </span>
            </div>

            <div class="flex justify-between gap-4 text-sm">
              <span class="text-slate-500"> Fecha de creación </span>

              <span class="text-right font-medium text-slate-800">
                {{ formatDate(order.createdAt) }}
              </span>
            </div>

            <div class="flex justify-between gap-4 border-t border-slate-200 pt-3">
              <span class="font-semibold text-slate-700"> Total </span>

              <span class="text-lg font-bold text-slate-900">
                {{ formatCurrency(order.amount) }}
              </span>
            </div>
          </div>
        </div>

        <p v-if="order.status === 'PENDING'" class="mt-5 text-xs leading-5 text-slate-500">
          Si acabas de realizar el pago, espera la notificación de confirmación y vuelve a consultar
          esta orden.
        </p>

        <div class="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <RouterLink
            :to="`/ordenes/${order.id}`"
            class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Ver detalle de la orden
          </RouterLink>

          <RouterLink
            to="/mis-compras"
            class="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Mis compras
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
