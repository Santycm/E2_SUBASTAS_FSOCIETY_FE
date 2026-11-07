<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight, Gavel, ShieldCheck, Tag, TrendingUp } from 'lucide-vue-next'
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
  return categories.value.find((category) => category.id === categoryId)?.name ?? 'Sin categoría'
}

onMounted(() => {
  void loadAuctions()
  void loadCategories()
})
</script>

<template>
  <div>
    <section class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24"
      >
        <div>
          <p class="text-sm font-semibold text-primary-700">FSOCIETY · Plataforma de subastas</p>

          <h1
            class="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]"
          >
            Encuentra lo que buscas.
            <span class="text-primary-700"> Haz tu oferta. </span>
          </h1>

          <p class="mt-6 max-w-xl text-base leading-7 text-slate-600">
            Explora artículos en subasta, consulta las ofertas y participa para conseguir aquello
            que te interesa.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/subastas"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              Explorar subastas
              <ArrowRight :size="17" />
            </RouterLink>

            <RouterLink
              to="/registro"
              class="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              Crear una cuenta
            </RouterLink>
          </div>

          <div
            class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-slate-200 pt-6"
          >
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck :size="17" class="text-primary-700" />
              Participación segura
            </div>

            <div class="flex items-center gap-2 text-sm text-slate-600">
              <Gavel :size="17" class="text-primary-700" />
              Ofertas en tiempo real
            </div>
          </div>
        </div>

        <div class="lg:pl-10">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
            <div class="border-b border-slate-200 pb-6">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cómo funciona
              </p>

              <h2 class="mt-2 text-xl font-bold text-slate-900">Participar es sencillo</h2>

              <p class="mt-2 text-sm leading-6 text-slate-600">
                Sigue estos pasos para participar en las subastas disponibles.
              </p>
            </div>

            <div class="divide-y divide-slate-200">
              <div class="flex gap-4 py-5">
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-800"
                >
                  01
                </span>

                <div>
                  <h3 class="text-sm font-semibold text-slate-900">Explora las subastas</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600">
                    Consulta los artículos disponibles y sus condiciones.
                  </p>
                </div>
              </div>

              <div class="flex gap-4 py-5">
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-800"
                >
                  02
                </span>

                <div>
                  <h3 class="text-sm font-semibold text-slate-900">Realiza tus ofertas</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600">
                    Participa y sigue la evolución de las ofertas.
                  </p>
                </div>
              </div>

              <div class="flex gap-4 pt-5">
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-800"
                >
                  03
                </span>

                <div>
                  <h3 class="text-sm font-semibold text-slate-900">Consulta el resultado</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600">
                    Revisa el resultado de la subasta y el estado de tus participaciones.
                  </p>
                </div>
              </div>
            </div>

            <RouterLink
              to="/subastas"
              class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
            >
              Ver subastas disponibles
              <ArrowRight :size="16" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-xs font-bold tracking-widest text-primary-600 uppercase">Explora</p>

          <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Categorías
          </h2>

          <p class="mt-2 text-sm text-slate-500">Descubre las subastas según tus intereses.</p>
        </div>

        <RouterLink
          to="/subastas"
          class="inline-flex items-center gap-2 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
        >
          Ver todas las subastas
          <ArrowUpRight :size="17" />
        </RouterLink>
      </div>

      <div v-if="loadingCategories" class="py-8">
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
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white"
          >
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

        <div v-if="loadingAuctions" class="py-10">
          <LoadingState message="Cargando subastas..." />
        </div>

        <div v-else-if="auctions.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <div
        class="overflow-hidden rounded-2xl bg-primary-700 px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12"
      >
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
