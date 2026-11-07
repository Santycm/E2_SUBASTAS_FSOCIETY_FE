
<script setup lang="ts">
import { Clock, Gavel, LockKeyhole } from 'lucide-vue-next'
import type { Bid } from '@/types/bid.types'

defineProps<{
  bids: Bid[]
  loading: boolean
  isAuthenticated: boolean
}>()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatBidder(id: string): string {
  if (id.length <= 12) return id

  return `${id.slice(0, 8)}...${id.slice(-4)}`
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Historial de ofertas</h3>
        <p class="mt-1 text-sm text-slate-500">
          Registro de las ofertas realizadas en esta subasta.
        </p>
      </div>

      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Gavel :size="20" />
      </div>
    </div>

    <div
      v-if="!isAuthenticated"
      class="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center"
    >
      <LockKeyhole :size="30" class="mx-auto mb-3 text-slate-400" />

      <p class="font-semibold text-slate-700">
        Historial no disponible
      </p>

      <p class="mt-1 text-sm text-slate-500">
        Inicia sesión para consultar las ofertas realizadas en esta subasta.
      </p>
    </div>

    <div v-else-if="loading" class="space-y-4">
      <div
        v-for="item in 3"
        :key="item"
        class="animate-pulse rounded-xl bg-slate-100 p-4"
      >
        <div class="mb-3 h-4 w-1/3 rounded bg-slate-200" />
        <div class="h-3 w-1/2 rounded bg-slate-200" />
      </div>
    </div>

    <div
      v-else-if="bids.length === 0"
      class="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center"
    >
      <Gavel :size="30" class="mx-auto mb-3 text-slate-300" />

      <p class="font-semibold text-slate-700">
        Todavía no hay ofertas
      </p>

      <p class="mt-1 text-sm text-slate-500">
        Sé el primero en participar en esta subasta.
      </p>
    </div>

    <div v-else class="divide-y divide-slate-100">
      <article
        v-for="bid in bids"
        :key="bid.id"
        class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
      >
        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-900">
            {{ formatCurrency(bid.amount) }}
          </p>

          <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Usuario {{ formatBidder(bid.bidderId) }}</span>

            <span class="text-slate-300">·</span>

            <span class="inline-flex items-center gap-1">
              <Clock :size="12" />
              {{ formatDate(bid.createdAt) }}
            </span>
          </div>
        </div>

        <span
          class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
          :class="
            bid.status === 'ACCEPTED'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          "
        >
          {{ bid.status === 'ACCEPTED' ? 'Aceptada' : 'Rechazada' }}
        </span>
      </article>
    </div>
  </section>
</template>
