<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowUpRight,
  Clock3,
  Gavel,
  Tag,
} from 'lucide-vue-next'
import type { Auction } from '@/types/auction.types'

interface Props {
  auction: Auction
  categoryName?: string
}

const props = withDefaults(defineProps<Props>(), {
  categoryName: 'Sin categoría',
})

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const currentPrice = computed(() => {
  return props.auction.currentBid ?? props.auction.basePrice
})

const priceLabel = computed(() => {
  return props.auction.currentBid === null
    ? 'Precio inicial'
    : 'Oferta actual'
})

const statusConfig = computed(() => {
  const statuses = {
    OPEN: {
      label: 'En curso',
      classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    },
    CLOSED: {
      label: 'Finalizada',
      classes: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    },
    CANCELLED: {
      label: 'Cancelada',
      classes: 'bg-red-50 text-red-700 ring-red-600/20',
    },
    NO_BIDS: {
      label: 'Sin ofertas',
      classes: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    },
  }

  return statuses[props.auction.status]
})

const formattedCloseDate = computed(() => {
  const date = new Date(props.auction.closesAt)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible'
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
})
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-slate-200/60">
    <div class="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-indigo-50 to-slate-100">
      <div class="absolute -right-8 -top-10 size-40 rounded-full bg-primary-100/70" />
      <div class="absolute -bottom-16 -left-8 size-40 rounded-full bg-indigo-100/70" />

      <div class="relative flex size-20 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-primary-600 shadow-sm backdrop-blur">
        <Gavel :size="34" :stroke-width="1.5" />
      </div>

      <span
        class="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset"
        :class="statusConfig.classes"
      >
        {{ statusConfig.label }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Tag :size="13" />
        <span>{{ categoryName }}</span>
      </div>

      <h3 class="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-primary-700">
        {{ auction.title }}
      </h3>

      <p class="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
        {{ auction.description }}
      </p>

      <div class="mt-5 border-t border-slate-100 pt-4">
        <p class="text-xs font-medium text-slate-400">
          {{ priceLabel }}
        </p>

        <p class="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
          {{ formatter.format(currentPrice) }}
        </p>

        <div class="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Clock3 :size="14" class="shrink-0" />
          <span>Cierra: {{ formattedCloseDate }}</span>
        </div>
      </div>

      <RouterLink
        :to="{ name: 'auction-detail', params: { id: auction.id } }"
        class="mt-5 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-600 hover:text-white"
      >
        Ver subasta
        <ArrowUpRight :size="16" />
      </RouterLink>
    </div>
  </article>
</template>