
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  UserRound,
  Gavel,
  ShoppingBag,
  Store,
  ArrowRight,
  RefreshCw,
  CalendarDays,
} from 'lucide-vue-next'

import { userService } from '@/services/user.service'
import type { UserProfile } from '@/services/user.service'
import type { Auction, AuctionStatus } from '@/types/auction.types'

import { formatCurrency } from '@/utils/currency'
import { formatDate, formatRemainingTime } from '@/utils/date'

const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const errorMessage = ref('')

const publishedAuctions = computed(
  () => profile.value?.publishedAuctions ?? [],
)

const participatedAuctions = computed(
  () => profile.value?.participatedAuctions ?? [],
)

const totalAuctions = computed(
  () => publishedAuctions.value.length + participatedAuctions.value.length,
)

async function loadProfile() {
  loading.value = true
  errorMessage.value = ''

  try {
    profile.value = await userService.getMe()
  } catch {
    errorMessage.value = 'No fue posible cargar tu perfil. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function getStatusLabel(status: AuctionStatus): string {
  const labels: Record<AuctionStatus, string> = {
    OPEN: 'Abierta',
    CLOSED: 'Finalizada',
    CANCELLED: 'Cancelada',
    NO_BIDS: 'Sin ofertas',
  }

  return labels[status]
}

function getStatusClasses(status: AuctionStatus): string {
  const classes: Record<AuctionStatus, string> = {
    OPEN: 'bg-green-50 text-green-700',
    CLOSED: 'bg-slate-100 text-slate-600',
    CANCELLED: 'bg-red-50 text-red-700',
    NO_BIDS: 'bg-amber-50 text-amber-700',
  }

  return classes[status]
}

function getAuctionPrice(auction: Auction): number {
  return auction.currentBid ?? auction.basePrice
}

function getAuctionTime(auction: Auction): string {
  if (auction.status !== 'OPEN') {
    return formatDate(auction.closesAt)
  }

  return formatRemainingTime(auction.closesAt)
}

onMounted(loadProfile)
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">
        Mi perfil
      </h1>

      <p class="mt-1 text-sm text-slate-500">
        Consulta tu información y la actividad que tienes en Subastas.
      </p>
    </div>

    <div
      v-if="loading"
      class="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white"
    >
      <RefreshCw
        :size="28"
        class="animate-spin text-primary-600"
      />

      <p class="mt-4 text-sm text-slate-500">
        Cargando tu perfil...
      </p>
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
        @click="loadProfile"
      >
        <RefreshCw :size="16" />
        Intentar nuevamente
      </button>
    </div>

    <template v-else-if="profile">
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr]">
        <aside class="space-y-5">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex flex-col items-center text-center">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
                {{ getInitials(profile.name) }}
              </div>

              <h2 class="mt-4 text-lg font-bold text-slate-900">
                {{ profile.name }}
              </h2>

              <p class="mt-1 break-all text-sm text-slate-500">
                {{ profile.email }}
              </p>

              <span class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <UserRound :size="13" />
                Usuario registrado
              </span>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900">
              Resumen de actividad
            </h3>

            <div class="mt-5 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Gavel :size="19" />
                  </div>

                  <span class="text-sm text-slate-600">
                    Subastas publicadas
                  </span>
                </div>

                <span class="text-lg font-bold text-slate-900">
                  {{ publishedAuctions.length }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <ShoppingBag :size="19" />
                  </div>

                  <span class="text-sm text-slate-600">
                    Subastas participadas
                  </span>
                </div>

                <span class="text-lg font-bold text-slate-900">
                  {{ participatedAuctions.length }}
                </span>
              </div>

              <div class="border-t border-slate-100 pt-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-700">
                    Actividad total
                  </span>

                  <span class="text-xl font-bold text-primary-700">
                    {{ totalAuctions }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900">
              Accesos rápidos
            </h3>

            <div class="mt-3 space-y-1">
              <RouterLink
                to="/publicar"
                class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-600"
              >
                Publicar subasta
                <ArrowRight :size="16" />
              </RouterLink>

              <RouterLink
                to="/mis-compras"
                class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-600"
              >
                Mis compras
                <ArrowRight :size="16" />
              </RouterLink>

              <RouterLink
                to="/mis-ventas"
                class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-600"
              >
                Mis ventas
                <ArrowRight :size="16" />
              </RouterLink>
            </div>
          </div>
        </aside>

        <div class="space-y-8">
          <section>
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  Mis subastas publicadas
                </h2>

                <p class="mt-1 text-sm text-slate-500">
                  Productos que has puesto a disposición de otros participantes.
                </p>
              </div>

              <RouterLink
                to="/mis-ventas"
                class="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:inline-flex"
              >
                Ver ventas
                <ArrowRight :size="15" />
              </RouterLink>
            </div>

            <div
              v-if="publishedAuctions.length === 0"
              class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"
            >
              <Store
                :size="30"
                class="mx-auto text-slate-400"
              />

              <h3 class="mt-3 text-sm font-semibold text-slate-800">
                Todavía no has publicado subastas
              </h3>

              <p class="mt-1 text-sm text-slate-500">
                Publica tu primer producto y permite que otros usuarios participen.
              </p>

              <RouterLink
                to="/publicar"
                class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Publicar subasta
                <ArrowRight :size="16" />
              </RouterLink>
            </div>

            <div
              v-else
              class="space-y-3"
            >
              <RouterLink
                v-for="auction in publishedAuctions"
                :key="auction.id"
                :to="`/subastas/${auction.id}`"
                class="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="truncate text-sm font-bold text-slate-900">
                        {{ auction.title }}
                      </h3>

                      <span
                        class="rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="getStatusClasses(auction.status)"
                      >
                        {{ getStatusLabel(auction.status) }}
                      </span>
                    </div>

                    <p class="mt-2 line-clamp-2 text-sm text-slate-500">
                      {{ auction.description }}
                    </p>

                    <div class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays :size="14" />
                      <span>
                        {{ auction.status === 'OPEN' ? 'Cierra' : 'Fecha de cierre' }}:
                        {{ getAuctionTime(auction) }}
                      </span>
                    </div>
                  </div>

                  <div class="shrink-0 sm:text-right">
                    <p class="text-xs text-slate-400">
                      {{ auction.currentBid !== null ? 'Oferta actual' : 'Precio inicial' }}
                    </p>

                    <p class="mt-1 text-base font-bold text-slate-900">
                      {{ formatCurrency(getAuctionPrice(auction)) }}
                    </p>

                    <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                      Ver subasta
                      <ArrowRight :size="14" />
                    </span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </section>

          <section>
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  Subastas en las que he participado
                </h2>

                <p class="mt-1 text-sm text-slate-500">
                  Productos por los que has realizado ofertas.
                </p>
              </div>
            </div>

            <div
              v-if="participatedAuctions.length === 0"
              class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"
            >
              <ShoppingBag
                :size="30"
                class="mx-auto text-slate-400"
              />

              <h3 class="mt-3 text-sm font-semibold text-slate-800">
                Todavía no has participado en subastas
              </h3>

              <p class="mt-1 text-sm text-slate-500">
                Explora el catálogo y encuentra productos de tu interés.
              </p>

              <RouterLink
                to="/subastas"
                class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Explorar subastas
                <ArrowRight :size="16" />
              </RouterLink>
            </div>

            <div
              v-else
              class="space-y-3"
            >
              <RouterLink
                v-for="auction in participatedAuctions"
                :key="auction.id"
                :to="`/subastas/${auction.id}`"
                class="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="truncate text-sm font-bold text-slate-900">
                        {{ auction.title }}
                      </h3>

                      <span
                        class="rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="getStatusClasses(auction.status)"
                      >
                        {{ getStatusLabel(auction.status) }}
                      </span>
                    </div>

                    <p class="mt-2 line-clamp-2 text-sm text-slate-500">
                      {{ auction.description }}
                    </p>

                    <div class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays :size="14" />
                      <span>
                        {{ auction.status === 'OPEN' ? 'Cierra' : 'Fecha de cierre' }}:
                        {{ getAuctionTime(auction) }}
                      </span>
                    </div>
                  </div>

                  <div class="shrink-0 sm:text-right">
                    <p class="text-xs text-slate-400">
                      {{ auction.currentBid !== null ? 'Oferta actual' : 'Precio inicial' }}
                    </p>

                    <p class="mt-1 text-base font-bold text-slate-900">
                      {{ formatCurrency(getAuctionPrice(auction)) }}
                    </p>

                    <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                      Ver subasta
                      <ArrowRight :size="14" />
                    </span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </section>
        </div>
      </div>
    </template>
  </section>
</template>
