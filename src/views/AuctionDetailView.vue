<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CalendarDays, Clock, Gavel, Radio, RefreshCw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { auctionService } from '@/services/auction.service'
import { userService } from '@/services/user.service'
import { bidService } from '@/services/bid.service'
import { useAuctionSocket } from '@/composables/useAuctionSocket'
import { useAuthStore } from '@/stores/auth.store'

import BidForm from '@/components/auctions/BidForm.vue'
import BidHistory from '@/components/auctions/BidHistory.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'

import type { Auction } from '@/types/auction.types'
import type { Bid, BidRejectionReason } from '@/types/bid.types'
import type { PublicUser } from '@/types/user.types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const auction = ref<Auction | null>(null)
const bids = ref<Bid[]>([])

const seller = ref<PublicUser | null>(null)
const sellerLoading = ref(false)

const loading = ref(true)
const bidsLoading = ref(true)
const submittingBid = ref(false)

const auctionId = computed(() => String(route.params.id))

const isOpen = computed(() => auction.value?.status === 'OPEN')

const minimumBid = computed(() => {
  if (!auction.value) return 0

  if (auction.value.currentBid === null) {
    return auction.value.basePrice
  }

  return auction.value.currentBid + auction.value.minimumIncrement
})

const currentPrice = computed(() => {
  if (!auction.value) return 0

  return auction.value.currentBid ?? auction.value.basePrice
})

const formattedCurrentPrice = computed(() => formatCurrency(currentPrice.value))

const formattedBasePrice = computed(() => formatCurrency(auction.value?.basePrice ?? 0))

const formattedMinimumBid = computed(() => formatCurrency(minimumBid.value))

const formattedClosingDate = computed(() => {
  if (!auction.value) return ''

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(auction.value.closesAt))
})

const statusLabel = computed(() => {
  switch (auction.value?.status) {
    case 'OPEN':
      return 'Subasta activa'
    case 'CLOSED':
      return 'Subasta finalizada'
    case 'CANCELLED':
      return 'Subasta cancelada'
    case 'NO_BIDS':
      return 'Finalizada sin ofertas'
    default:
      return 'Estado desconocido'
  }
})

const statusClass = computed(() => {
  switch (auction.value?.status) {
    case 'OPEN':
      return 'bg-emerald-50 text-emerald-700'
    case 'CLOSED':
      return 'bg-slate-100 text-slate-700'
    case 'CANCELLED':
      return 'bg-red-50 text-red-700'
    case 'NO_BIDS':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
})

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
  }).format(new Date(value))
}

function getRejectionMessage(reason?: BidRejectionReason): string {
  const messages: Record<BidRejectionReason, string> = {
    AUCTION_NOT_OPEN: 'Esta subasta no está abierta para recibir ofertas.',
    AUCTION_CLOSED: 'La subasta ya ha finalizado.',
    SELLER_CANNOT_BID: 'No puedes ofertar en tu propia subasta.',
    LEADING_BIDDER_CANNOT_OUTBID_SELF: 'Ya tienes la oferta más alta.',
    AMOUNT_BELOW_MINIMUM: 'El valor ofertado es inferior al mínimo permitido.',
    AUCTION_CANCELLED: 'Esta subasta ha sido cancelada.',
    INVALID_AMOUNT: 'El valor de la oferta no es válido.',
  }

  return reason ? messages[reason] : 'No fue posible registrar tu oferta.'
}

async function loadAuction() {
  loading.value = true
  seller.value = null

  try {
    auction.value = await auctionService.getById(auctionId.value)
    await loadSeller()
  } catch {
    auction.value = null
    toast.error('No fue posible cargar la subasta.')
  } finally {
    loading.value = false
  }
}

async function loadBids() {
  if (!authStore.isAuthenticated) {
    bids.value = []
    bidsLoading.value = false
    return
  }

  bidsLoading.value = true

  try {
    bids.value = await bidService.getAll(auctionId.value)
  } catch {
    bids.value = []
    toast.error('No fue posible cargar el historial de ofertas.')
  } finally {
    bidsLoading.value = false
  }
}

async function loadSeller() {
  if (!auction.value) return

  sellerLoading.value = true

  try {
    seller.value = await userService.getPublicProfile(auction.value.sellerId)
  } catch {
    seller.value = null
    toast.error('No fue posible cargar la información del vendedor.')
  } finally {
    sellerLoading.value = false
  }
}

async function refreshAuctionData() {
  try {
    const auctionData = await auctionService.getById(auctionId.value)

    auction.value = auctionData

    if (authStore.isAuthenticated) {
      bids.value = await bidService.getAll(auctionId.value)
    } else {
      bids.value = []
    }
  } catch {
    toast.error('No fue posible actualizar la información de la subasta.')
  }
}

async function submitBid(amount: number) {
  if (!authStore.isAuthenticated) {
    toast.error('Debes iniciar sesión para realizar una oferta.')

    router.push({
      name: 'login',
      query: {
        redirect: route.fullPath,
      },
    })

    return
  }

  if (!isOpen.value) {
    toast.error('Esta subasta no está abierta para recibir ofertas.')
    return
  }

  submittingBid.value = true

  try {
    await bidService.create(auctionId.value, { amount })

    toast.success('Tu oferta fue registrada correctamente.')

    await refreshAuctionData()
  } catch (error: unknown) {
    const response = (
      error as {
        response?: {
          data?: {
            bid?: {
              rejectionReason?: BidRejectionReason | null
            }
          }
        }
      }
    ).response

    const reason = response?.data?.bid?.rejectionReason ?? undefined

    toast.error(getRejectionMessage(reason))

    await refreshAuctionData()
  } finally {
    submittingBid.value = false
  }
}

function handleBidPlaced() {
  void refreshAuctionData()
}

function handleBidOutbid() {
  void refreshAuctionData()
}

function handleAuctionClosed() {
  void refreshAuctionData()
  toast.info('La subasta ha finalizado.')
}

function handleSocketError(error: { message: string }) {
  toast.error(error.message || 'Se produjo un error en la conexión.')
}

const { isConnected, isJoined } = useAuctionSocket(auctionId.value, {
  onBidPlaced: handleBidPlaced,
  onBidOutbid: handleBidOutbid,
  onAuctionClosed: handleAuctionClosed,
  onSocketError: handleSocketError,
})

onMounted(async () => {
  await Promise.all([loadAuction(), loadBids()])
})

watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      void loadBids()
    } else {
      bids.value = []
      bidsLoading.value = false
    }
  },
)
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <button
      type="button"
      class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary-600"
      @click="router.push({ name: 'auctions' })"
    >
      <ArrowLeft :size="17" />
      Volver a las subastas
    </button>

    <LoadingState v-if="loading" />

    <EmptyState
      v-else-if="!auction"
      title="Subasta no encontrada"
      description="No fue posible encontrar la subasta solicitada."
    />

    <template v-else>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="space-y-8 lg:col-span-2">
          <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              class="relative flex min-h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-primary-800 p-8"
            >
              <div
                class="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10"
              />
              <div
                class="absolute -bottom-24 -left-12 h-72 w-72 rounded-full border border-white/10"
              />

              <div class="relative text-center">
                <div
                  class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur"
                >
                  <Gavel :size="38" />
                </div>

                <p class="text-sm font-semibold uppercase tracking-[0.25em] text-primary-200">
                  Subasta
                </p>

                <h1 class="mt-3 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                  {{ auction.title }}
                </h1>
              </div>
            </div>

            <div class="p-6 sm:p-8">
              <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span class="rounded-full px-3 py-1.5 text-sm font-semibold" :class="statusClass">
                  {{ statusLabel }}
                </span>

                <div class="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="isConnected && isJoined ? 'bg-emerald-500' : 'bg-slate-300'"
                  />

                  <Radio :size="14" />

                  {{ isConnected && isJoined ? 'Conectado en tiempo real' : 'Conectando...' }}
                </div>
              </div>

              <h2 class="mb-3 text-xl font-bold text-slate-900">Descripción</h2>

              <p class="whitespace-pre-line leading-7 text-slate-600">
                {{ auction.description }}
              </p>

              <div
                class="mt-8 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                  >
                    <CalendarDays :size="19" />
                  </div>

                  <div>
                    <p class="text-xs font-medium text-slate-500">Fecha de publicación</p>
                    <p class="mt-1 font-semibold text-slate-800">
                      {{ formatDate(auction.createdAt) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                  >
                    <Clock :size="19" />
                  </div>

                  <div>
                    <p class="text-xs font-medium text-slate-500">Fecha de cierre</p>
                    <p class="mt-1 font-semibold text-slate-800">
                      {{ formattedClosingDate }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                  >
                    <RefreshCw :size="19" />
                  </div>

                  <div>
                    <p class="text-xs font-medium text-slate-500">Incremento mínimo</p>
                    <p class="mt-1 font-semibold text-slate-800">
                      {{ formatCurrency(auction.minimumIncrement) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <BidHistory
            :bids="bids"
            :loading="bidsLoading"
            :is-authenticated="authStore.isAuthenticated"
          />
        </div>

        <aside class="space-y-6">
          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-slate-500">Oferta actual</p>

            <p class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              {{ formattedCurrentPrice }}
            </p>

            <div class="mt-5 space-y-3 border-t border-slate-100 pt-5">
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="text-slate-500">Precio base</span>
                <span class="font-semibold text-slate-800">
                  {{ formattedBasePrice }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="text-slate-500">Ofertas registradas</span>
                <span class="font-semibold text-slate-800">
                  {{ bids.filter((bid) => bid.status === 'ACCEPTED').length }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="text-slate-500">Próxima oferta mínima</span>
                <span class="font-bold text-primary-600">
                  {{ formattedMinimumBid }}
                </span>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700"
              >
                {{ seller?.name?.charAt(0).toUpperCase() ?? 'V' }}
              </div>

              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-500">Vendedor</p>

                <template v-if="seller">
                  <h3 class="truncate font-bold text-slate-900">
                    {{ seller.name }}
                  </h3>

                  <p class="truncate text-sm text-slate-500">
                    {{ seller.email }}
                  </p>
                </template>

                <p v-else-if="sellerLoading" class="mt-1 text-sm text-slate-400">
                  Cargando información...
                </p>

                <p v-else class="mt-1 text-sm text-slate-400">Información no disponible</p>
              </div>
            </div>
          </section>

          <BidForm
            v-if="isOpen && authStore.isAuthenticated"
            :minimum-bid="minimumBid"
            :loading="submittingBid"
            @submit="submitBid"
          />

          <div v-else-if="isOpen" class="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
            <h3 class="font-bold text-slate-900">¿Quieres participar?</h3>

            <p class="mt-2 text-sm text-slate-600">
              Inicia sesión para realizar ofertas en esta subasta.
            </p>

            <RouterLink
              to="/login"
              class="mt-4 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Iniciar sesión
            </RouterLink>
          </div>
        </aside>
      </div>
    </template>
  </main>
</template>
