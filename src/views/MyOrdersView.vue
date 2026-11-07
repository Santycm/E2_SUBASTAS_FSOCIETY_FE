<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingBag, ArrowRight, RefreshCw } from 'lucide-vue-next'

import { orderService } from '@/services/order.service'
import type { Order, OrderStatus } from '@/types/order.types'
import type { Pagination } from '@/types/pagination.types'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const orders = ref<Order[]>([])
const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
})

const selectedStatus = ref<OrderStatus | ''>('')
const loading = ref(true)
const errorMessage = ref('')

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

async function loadOrders(page = 1) {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await orderService.getAll({
      page,
      limit: pagination.value.limit,
      ...(selectedStatus.value ? { status: selectedStatus.value } : {}),
    })

    orders.value = response.data
    pagination.value = response.pagination
  } catch {
    errorMessage.value = 'No fue posible cargar tus compras.'
  } finally {
    loading.value = false
  }
}

function changeStatus(status: string) {
  selectedStatus.value = status as OrderStatus | ''
  loadOrders(1)
}

onMounted(() => loadOrders())
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-10">
    <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Mis compras</h1>

        <p class="mt-1 text-sm text-slate-500">
          Consulta las subastas que has ganado y el estado de tus pagos.
        </p>
      </div>

      <RouterLink
        to="/subastas"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        Explorar subastas
        <ArrowRight :size="16" />
      </RouterLink>
    </div>

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-medium text-slate-700">Historial de compras</p>

        <p class="text-xs text-slate-500">
          {{ pagination.total }}
          {{ pagination.total === 1 ? 'compra registrada' : 'compras registradas' }}
        </p>
      </div>

      <select
        :value="selectedStatus"
        class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        @change="changeStatus(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendientes de pago</option>
        <option value="PAID">Pagadas</option>
        <option value="EXPIRED">Expiradas</option>
      </select>
    </div>

    <div
      v-if="loading"
      class="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white"
    >
      <RefreshCw :size="28" class="animate-spin text-primary-600" />

      <p class="mt-4 text-sm text-slate-500">Cargando compras...</p>
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
        @click="loadOrders(pagination.page)"
      >
        <RefreshCw :size="16" />
        Intentar nuevamente
      </button>
    </div>

    <div
      v-else-if="orders.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
    >
      <ShoppingBag :size="34" class="mx-auto text-slate-400" />

      <h2 class="mt-4 text-base font-semibold text-slate-800">No tienes compras registradas</h2>

      <p class="mt-1 text-sm text-slate-500">
        Cuando ganes una subasta, podrás consultar aquí tu compra y realizar el pago.
      </p>

      <RouterLink
        to="/subastas"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        Explorar subastas
        <ArrowRight :size="16" />
      </RouterLink>
    </div>

    <template v-else>
      <div class="space-y-3">
        <RouterLink
          v-for="order in orders"
          :key="order.id"
          :to="`/ordenes/${order.id}`"
          class="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
        >
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-sm font-bold text-slate-900">Compra #{{ order.id.slice(-8) }}</h2>

                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="getStatusClasses(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>

              <p class="mt-2 text-xs text-slate-500">Subasta: {{ order.auctionId }}</p>

              <p class="mt-1 text-xs text-slate-400">
                Registrada el {{ formatDate(order.createdAt) }}
              </p>

              <p v-if="order.status === 'PENDING'" class="mt-1 text-xs text-amber-600">
                Fecha límite de pago: {{ formatDate(order.expiresAt) }}
              </p>
            </div>

            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <div class="sm:text-right">
                <p class="text-xs text-slate-400">Total de la compra</p>

                <p class="mt-1 text-lg font-bold text-slate-900">
                  {{ formatCurrency(order.amount) }}
                </p>
              </div>

              <ArrowRight :size="18" class="shrink-0 text-primary-600" />
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-if="pagination.totalPages > 1" class="mt-6 flex items-center justify-between">
        <p class="text-sm text-slate-500">
          Página {{ pagination.page }} de {{ pagination.totalPages }}
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="pagination.page <= 1"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            @click="loadOrders(pagination.page - 1)"
          >
            Anterior
          </button>

          <button
            type="button"
            :disabled="pagination.page >= pagination.totalPages"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            @click="loadOrders(pagination.page + 1)"
          >
            Siguiente
          </button>
        </div>
      </div>
    </template>
  </section>
</template>
