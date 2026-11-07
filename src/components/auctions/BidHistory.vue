<script setup lang="ts">
import { ref, watch } from 'vue'
import { Clock, Gavel, LockKeyhole, UserRound, CheckCircle2, XCircle } from 'lucide-vue-next'

import type { Bid, BidRejectionReason } from '@/types/bid.types'
import type { PublicUser } from '@/types/user.types'
import { userService } from '@/services/user.service'

const props = defineProps<{
  bids: Bid[]
  loading: boolean
  isAuthenticated: boolean
}>()

const bidderProfiles = ref<Record<string, PublicUser>>({})
const loadingProfiles = ref(false)

let requestVersion = 0

const rejectionReasons: Record<BidRejectionReason, string> = {
  AUCTION_NOT_OPEN: 'La subasta todavía no está abierta.',
  AUCTION_CLOSED: 'La subasta ya ha finalizado.',
  SELLER_CANNOT_BID: 'El vendedor no puede ofertar en su propia subasta.',
  LEADING_BIDDER_CANNOT_OUTBID_SELF: 'Ya eres el participante con la oferta más alta.',
  AMOUNT_BELOW_MINIMUM: 'El importe es inferior al mínimo permitido.',
  AUCTION_CANCELLED: 'La subasta fue cancelada.',
  INVALID_AMOUNT: 'El importe de la oferta no es válido.',
}

watch(
  () => [props.bids, props.isAuthenticated] as const,
  async ([bids, isAuthenticated]) => {
    const currentVersion = ++requestVersion

    if (!isAuthenticated) {
      bidderProfiles.value = {}
      loadingProfiles.value = false
      return
    }

    const bidderIds = [...new Set(bids.map((bid) => bid.bidderId))]

    const missingIds = bidderIds.filter((id) => !bidderProfiles.value[id])

    if (missingIds.length === 0) return

    loadingProfiles.value = true

    const results = await Promise.allSettled(
      missingIds.map(async (id) => ({
        id,
        profile: await userService.getPublicProfile(id),
      })),
    )

    if (currentVersion !== requestVersion) return

    const profiles = { ...bidderProfiles.value }

    for (const result of results) {
      if (result.status === 'fulfilled') {
        profiles[result.value.id] = result.value.profile
      }
    }

    bidderProfiles.value = profiles
    loadingProfiles.value = false
  },
  { immediate: true },
)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatId(id: string): string {
  return `${id.slice(0, 8)}...${id.slice(-4)}`
}

function getBidderName(id: string): string {
  return bidderProfiles.value[id]?.name ?? `Usuario ${formatId(id)}`
}

function getBidderEmail(id: string): string {
  return bidderProfiles.value[id]?.email ?? ''
}

function getRejectionReason(reason: string | null): string {
  if (!reason) return ''

  return (
    rejectionReasons[reason as BidRejectionReason] ??
    'La oferta fue rechazada por una regla de la subasta.'
  )
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Historial de ofertas</h3>

        <p class="mt-1 text-sm text-slate-500">
          Registro detallado de las ofertas realizadas en esta subasta.
        </p>
      </div>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
      >
        <Gavel :size="20" />
      </div>
    </div>

    <div
      v-if="!isAuthenticated"
      class="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center"
    >
      <LockKeyhole :size="30" class="mx-auto mb-3 text-slate-400" />

      <p class="font-semibold text-slate-700">Historial no disponible</p>

      <p class="mt-1 text-sm text-slate-500">
        Inicia sesión para consultar las ofertas realizadas en esta subasta.
      </p>
    </div>

    <div v-else-if="loading" class="space-y-4">
      <div v-for="item in 3" :key="item" class="animate-pulse rounded-xl bg-slate-100 p-4">
        <div class="mb-3 h-4 w-1/3 rounded bg-slate-200" />
        <div class="h-3 w-1/2 rounded bg-slate-200" />
      </div>
    </div>

    <div
      v-else-if="bids.length === 0"
      class="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center"
    >
      <Gavel :size="30" class="mx-auto mb-3 text-slate-300" />

      <p class="font-semibold text-slate-700">Todavía no hay ofertas</p>

      <p class="mt-1 text-sm text-slate-500">Sé el primero en participar en esta subasta.</p>
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="bid in bids"
        :key="bid.id"
        class="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <UserRound :size="17" class="shrink-0 text-slate-400" />

              <p class="truncate font-semibold text-slate-900">
                {{ getBidderName(bid.bidderId) }}
              </p>
            </div>

            <p v-if="getBidderEmail(bid.bidderId)" class="mt-1 break-all text-sm text-slate-500">
              {{ getBidderEmail(bid.bidderId) }}
            </p>

            <p v-else-if="loadingProfiles" class="mt-1 text-xs text-slate-400">
              Cargando información del participante...
            </p>
          </div>

          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            :class="
              bid.status === 'ACCEPTED'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            "
          >
            <CheckCircle2 v-if="bid.status === 'ACCEPTED'" :size="14" />

            <XCircle v-else :size="14" />

            {{ bid.status === 'ACCEPTED' ? 'Aceptada' : 'Rechazada' }}
          </span>
        </div>

        <div class="my-4 border-t border-slate-100" />

        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-slate-500">Importe de la oferta</p>

            <p class="mt-1 text-xl font-bold text-slate-900">
              {{ formatCurrency(bid.amount) }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs font-medium text-slate-500">Fecha de registro</p>

            <p class="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-700">
              <Clock :size="14" class="text-slate-400" />
              {{ formatDate(bid.createdAt) }}
            </p>
          </div>
        </div>

        <div
          v-if="bid.status === 'REJECTED' && bid.rejectionReason"
          class="mt-4 rounded-lg border border-red-100 bg-red-50 p-3"
        >
          <p class="text-xs font-semibold text-red-700">Motivo del rechazo</p>

          <p class="mt-1 text-sm text-red-700">
            {{ getRejectionReason(bid.rejectionReason) }}
          </p>
        </div>

        <div
          v-else-if="bid.status === 'ACCEPTED'"
          class="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3"
        >
          <p class="text-sm text-emerald-700">La oferta fue aceptada y registrada correctamente.</p>
        </div>

        <p class="mt-3 text-right text-xs text-slate-400">Oferta #{{ formatId(bid.id) }}</p>
      </article>
    </div>
  </section>
</template>
