<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  ArrowUpRight,
  Gavel,
  ShieldCheck,
  Tag,
  TrendingUp,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import AuctionCard from '@/components/auctions/AuctionCard.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'

import { auctionService } from '@/services/auction.service'
import { categoryService } from '@/services/category.service'

import type { Auction } from '@/types/auction.types'
import type { Category } from '@/types/category.types'

const auctions = ref<Auction[]>([])
const categories = ref<Category[]>([])

const loadingAuctions = ref(true)
const loadingCategories = ref(true)

const loadAuctions = async () => {
  loadingAuctions.value = true

  try {
    const response = await auctionService.getAll({
      status: 'OPEN',
      page: 1,
      limit: 8,
    })

    auctions.value = response.data
  } catch {
    toast.error('No fue posible cargar las subastas.')
  } finally {
    loadingAuctions.value = false
  }
}

const loadCategories = async () => {
  loadingCategories.value = true

  try {
    categories.value = await categoryService.getAll()
  } catch {
    toast.error('No fue posible cargar las categorías.')
  } finally {
    loadingCategories.value = false
  }
}

const getCategoryName = (categoryId: string) => {
  return categories.value.find(
    (category) => category.id === categoryId,
  )?.name ?? 'Sin categoría'
}

onMounted(() => {
  void loadAuctions()
  void loadCategories()
})
</script>

<template>
  <div>
    <section class="relative isolate overflow-hidden bg-slate-950">
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute -right-40 -top-48 size-[550px] rounded-full bg-primary-600/20 blur-3xl" />
        <div class="absolute -bottom-60 left-1/4 size-[500px] rounded-full bg-indigo-500/15 blur-3xl" />
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-200">
            <span class="size-1.5 rounded-full bg-emerald-400" />
            Descubre nuevas oportunidades
          </div>

          <h1 class="mt-7 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Encuentra.
            <span class="text-primary-400">Oferta.</span>
            Gana.
          </h1>

          <p class="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Participa en subastas, compite por lo que te interesa y descubre oportunidades en un solo lugar.
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/subastas"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-sm font-bold text-white shadow-lg shadow-primary-950/30 transition-colors hover:bg-primary-500"
            >
              Explorar subastas
              <ArrowRight :size="18" />
            </RouterLink>

            <RouterLink
              to="/registro"
              class="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-600 px-6 text-sm font-bold text-white transition-colors hover:border-slate-400 hover:bg-white/5"
            >
              Crear una cuenta
            </RouterLink>
          </div>

          <div class="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            <div class="flex items-center gap-2 text-sm text-slate-300">
              <ShieldCheck :size="17" class="text-emerald-400" />
              Participación segura
            </div>

            <div class="flex items-center gap-2 text-sm text-slate-300">
              <Gavel :size="17" class="text-primary-400" />
              Ofertas en tiempo real
            </div>
          </div>
        </div>

        <div class="relative hidden lg:block">
          <div class="absolute inset-0 rounded-full bg-primary-500/10 blur-3xl" />

          <div class="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-400">
                  Tu próxima oportunidad
                </p>
                <h2 class="mt-1 text-xl font-bold text-white">
                  Comienza a participar
                </h2>
              </div>

              <div class="flex size-12 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
                <Gavel :size="25" />
              </div>
            </div>

            <div class="my-8 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary-500/20 to-indigo-500/5 py-12">
              <div class="flex size-32 items-center justify-center rounded-full border border-primary-300/20 bg-primary-400/10">
                <Gavel :size="58" class="text-primary-300" :stroke-width="1.3" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <TrendingUp :size="20" class="text-emerald-400" />
                <p class="mt-3 text-sm font-semibold text-white">
                  Ofertas competitivas
                </p>
                <p class="mt-1 text-xs text-slate-400">
                  Participa y supera ofertas.
                </p>
              </div>

              <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <Tag :size="20" class="text-primary-300" />
                <p class="mt-3 text-sm font-semibold text-white">
                  Varias categorías
                </p>
                <p class="mt-1 text-xs text-slate-400">
                  Encuentra lo que buscas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-xs font-bold tracking-widest text-primary-600 uppercase">
            Explora
          </p>

          <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Categorías
          </h2>

          <p class="mt-2 text-sm text-slate-500">
            Descubre las subastas según tus intereses.
          </p>
        </div>

        <RouterLink
          to="/subastas"
          class="inline-flex items-center gap-2 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
        >
          Ver todas las subastas
          <ArrowUpRight :size="17" />
        </RouterLink>
      </div>

      <div
        v-if="loadingCategories"
        class="py-8"
      >
        <LoadingState message="Cargando categorías..." min-height="120px" />
      </div>

      <div
        v-else-if="categories.length"
        class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="{ name: 'auctions', query: { categoryId: category.id } }"
          class="group flex min-h-28 items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-md"
        >
          <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
            <Tag :size="22" />
          </div>

          <div class="min-w-0">
            <h3 class="truncate text-sm font-bold text-slate-800">
              {{ category.name }}
            </h3>

            <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
              {{ category.description }}
            </p>
          </div>
        </RouterLink>
      </div>

      <EmptyState
        v-else
        title="No hay categorías disponibles"
        description="Las categorías aparecerán aquí cuando estén disponibles."
      />
    </section>

    <section class="bg-slate-100/70">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p class="text-xs font-bold tracking-widest text-primary-600 uppercase">
              Oportunidades
            </p>

            <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Subastas recientes
            </h2>

            <p class="mt-2 text-sm text-slate-500">
              Estas son algunas de las subastas que están en curso.
            </p>
          </div>

          <RouterLink
            to="/subastas"
            class="inline-flex items-center gap-2 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
          >
            Explorar todas
            <ArrowRight :size="17" />
          </RouterLink>
        </div>

        <div
          v-if="loadingAuctions"
          class="py-10"
        >
          <LoadingState message="Cargando subastas..." />
        </div>

        <div
          v-else-if="auctions.length"
          class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AuctionCard
            v-for="auction in auctions"
            :key="auction.id"
            :auction="auction"
            :category-name="getCategoryName(auction.categoryId)"
          />
        </div>

        <EmptyState
          v-else
          class="mt-8"
          title="Todavía no hay subastas activas"
          description="Cuando se publiquen nuevas subastas, podrás descubrirlas aquí."
        />
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-2xl bg-primary-700 px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12">
        <div class="max-w-2xl">
          <p class="text-xs font-bold tracking-widest text-primary-200 uppercase">
            ¿Tienes algo para ofrecer?
          </p>

          <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Publica tu propia subasta
          </h2>

          <p class="mt-3 text-sm leading-6 text-primary-100">
            Crea una subasta, recibe ofertas y encuentra compradores interesados.
          </p>
        </div>

        <RouterLink
          to="/publicar"
          class="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 lg:mt-0"
        >
          Publicar subasta
          <ArrowRight :size="18" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>