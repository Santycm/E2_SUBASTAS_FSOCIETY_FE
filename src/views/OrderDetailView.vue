<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ExternalLink, RefreshCw, ShoppingBag } from 'lucide-vue-next'

import { orderService } from '@/services/order.service'
import { auctionService } from '@/services/auction.service'
import { userService } from '@/services/user.service'

import type { Order, OrderStatus } from '@/types/order.types'
import type { Auction } from '@/types/auction.types'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const route = useRoute()

const order = ref<Order | null>(null)
const auction = ref<Auction | null>(null)
const currentUserId = ref('')

const loading = ref(true)
const paying = ref(false)
const errorMessage = ref('')
const paymentError = ref('')

const canPay = computed(
  () => order.value?.status === 'PENDING' && order.value.buyerId === currentUserId.value,
)

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pendiente de pago',
    PAID: 'Pagada',
    EXPIRED: 'Expirada',
  }

  return labels[status]
}

function getStatusClasses(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    PAID: 'bg-green-50 text-green-700',
    EXPIRED: 'bg-slate-100 text-slate-600',
  }

  return classes[status]
}

async function loadOrder() {
  loading.value = true
  errorMessage.value = ''

  try {
    const orderId = String(route.params.id)

    const [orderData, userData] = await Promise.all([
      orderService.getById(orderId),
      userService.getMe(),
    ])

    order.value = orderData
    currentUserId.value = userData.id

    try {
      auction.value = await auctionService.getById(orderData.auctionId)
    } catch {
      auction.value = null
    }
  } catch {
    errorMessage.value = 'No fue posible cargar la información de esta orden.'
  } finally {
    loading.value = false
  }
}

async function startPayment() {
  if (!order.value || !canPay.value || paying.value) {
    return
  }

  paying.value = true
  paymentError.value = ''

  try {
    const checkout = await orderService.createPayment(order.value.id)
    window.location.href = checkout.checkoutUrl
  } catch {
    paymentError.value = 'No fue posible iniciar el pago. Intenta nuevamente.'
    paying.value = false
  }
}

onMounted(loadOrder)
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-10">
    <RouterLink
      to="/mis-compras"
      class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600"
    >
      <ArrowLeft :size="16" />
      Volver a mis compras
    </RouterLink>

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Detalle de la orden</h1>

      <p class="mt-1 text-sm text-slate-500">
        Consulta la información de tu compra y su estado de pago.
      </p>
    </div>

    <div
      v-if="loading"
      class="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white"
    >
      <RefreshCw :size="28" class="animate-spin text-primary-600" />

      <p class="mt-4 text-sm text-slate-500">Cargando orden...</p>
    </div>

    <div
      v-else-if="errorMessage"
      class="rounded-2xl border border-red-200 bg-white p-8 text-center"
    >
      <p class="text-sm font-medium text-red-600">
        {{ errorMessage }}
      </p>

      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
        @click="loadOrder"
      >
        <RefreshCw :size="16" />
        Intentar nuevamente
      </button>
    </div>

    <template v-else-if="order">
      <div class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                Identificador de orden
              </p>

              <h2 class="mt-1 break-all text-lg font-bold text-slate-900">#{{ order.id }}</h2>
            </div>

            <span
              class="w-fit rounded-full px-3 py-1.5 text-xs font-semibold"
              :class="getStatusClasses(order.status)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <p class="text-xs text-slate-400">Fecha de creación</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Fecha límite de pago</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ formatDate(order.expiresAt) }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Identificador de subasta</p>

              <RouterLink
                :to="`/subastas/${order.auctionId}`"
                class="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                {{ order.auctionId }}
                <ExternalLink :size="13" />
              </RouterLink>
            </div>

            <div>
              <p class="text-xs text-slate-400">Identificador del comprador</p>

              <p class="mt-1 break-all text-sm font-medium text-slate-800">
                {{ order.buyerId }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
            >
              <ShoppingBag :size="21" />
            </div>

            <div>
              <h2 class="text-base font-bold text-slate-900">Producto adquirido</h2>

              <p class="text-xs text-slate-500">Información de la subasta asociada.</p>
            </div>
          </div>

          <div class="mt-5 border-t border-slate-100 pt-5">
            <template v-if="auction">
              <h3 class="text-lg font-bold text-slate-900">
                {{ auction.title }}
              </h3>

              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ auction.description }}
              </p>
            </template>

            <p v-else class="text-sm text-slate-500">
              No fue posible cargar los detalles de la subasta.
            </p>
          </div>

          <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
            <span class="text-sm font-semibold text-slate-600"> Total de la orden </span>

            <span class="text-2xl font-bold text-slate-900">
              {{ formatCurrency(order.amount) }}
            </span>
          </div>
        </div>

        <div v-if="canPay" class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 class="text-base font-bold text-slate-900">Esta compra está pendiente de pago</h2>

          <p class="mt-1 text-sm text-slate-600">
            Completa el pago antes de la fecha límite para finalizar tu compra.
          </p>

          <p v-if="paymentError" class="mt-4 text-sm font-medium text-red-600">
            {{ paymentError }}
          </p>

          <button
            type="button"
            :disabled="paying"
            class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            @click="startPayment"
          >
            <RefreshCw v-if="paying" :size="16" class="animate-spin" />

            <ExternalLink v-else :size="16" />

            {{ paying ? 'Conectando con Mercado Pago...' : 'Pagar con Mercado Pago' }}
          </button>
        </div>

        <div
          v-else-if="order.status === 'PAID'"
          class="rounded-2xl border border-green-200 bg-green-50 p-6"
        >
          <h2 class="text-base font-bold text-green-800">Pago registrado</h2>

          <p class="mt-1 text-sm text-green-700">
            El pago de esta orden figura como aprobado en el sistema.
          </p>
        </div>

        <div
          v-else-if="order.status === 'EXPIRED'"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <h2 class="text-base font-bold text-slate-800">Orden expirada</h2>

          <p class="mt-1 text-sm text-slate-600">
            El plazo establecido para completar el pago ha finalizado.
          </p>
        </div>

        <div
          v-else-if="order.status === 'PENDING'"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <h2 class="text-base font-bold text-slate-800">Pago pendiente</h2>

          <p class="mt-1 text-sm text-slate-600">
            Esta orden no pertenece al comprador autenticado. Puedes consultar su estado, pero no
            iniciar el pago.
          </p>
        </div>
      </div>
    </template>
  </section>
</template>
