<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import AuctionCard from '@/components/auctions/AuctionCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingState from '@/components/common/LoadingState.vue'

import { auctionService } from '@/services/auction.service'
import { categoryService } from '@/services/category.service'

import type {
  Auction,
  AuctionStatus,
} from '@/types/auction.types'
import type { Category } from '@/types/category.types'

const route = useRoute()

const auctions = ref<Auction[]>([])
const categories = ref<Category[]>([])

const selectedCategory = ref(
  typeof route.query.categoryId === 'string'
    ? route.query.categoryId
    : '',
)

const selectedStatus = ref<AuctionStatus | ''>('')

const page = ref(1)
const limit = 12

const total = ref(0)
const totalPages = ref(0)

const loadingAuctions = ref(true)
const loadingCategories = ref(true)

const fetchAuctions = async () => {
  loadingAuctions.value = true

  try {
    const response = await auctionService.getAll({
      categoryId: selectedCategory.value || undefined,
      status: selectedStatus.value || undefined,
      page: page.value,
      limit,
    })

    auctions.value = response.data
    total.value = response.pagination.total
    totalPages.value = response.pagination.totalPages
  } catch {
    auctions.value = []
    total.value = 0
    totalPages.value = 0

    toast.error('No fue posible cargar las subastas.')
  } finally {
    loadingAuctions.value = false
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true

  try {
    categories.value = await categoryService.getAll()
  } catch {
    toast.error('No fue posible cargar las categorías.')
  } finally {
    loadingCategories.value = false
  }
}

const handleFilterChange = () => {
  if (page.value === 1) {
    void fetchAuctions()
    return
  }

  page.value = 1
}

const clearFilters = () => {
  selectedCategory.value = ''
  selectedStatus.value = ''
  handleFilterChange()
}

const getCategoryName = (categoryId: string) => {
  return categories.value.find(
    (category) => category.id === categoryId,
  )?.name ?? 'Sin categoría'
}

watch(page, () => {
  void fetchAuctions()
})

watch(
  () => route.query.categoryId,
  (categoryId) => {
    selectedCategory.value =
      typeof categoryId === 'string' ? categoryId : ''

    handleFilterChange()
  },
)

onMounted(() => {
  void fetchAuctions()
  void fetchCategories()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <section class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p class="text-xs font-bold tracking-widest text-primary-600 uppercase">
          Marketplace
        </p>

        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Explorar subastas
        </h1>

        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Descubre oportunidades, consulta las ofertas actuales y participa en las subastas disponibles.
        </p>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <SlidersHorizontal :size="20" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Filtrar subastas
              </h2>

              <p class="mt-0.5 text-xs text-slate-500">
                Selecciona los criterios que deseas consultar.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-500 transition-colors hover:text-primary-700 sm:self-center"
            @click="clearFilters"
          >
            <RotateCcw :size="15" />
            Limpiar filtros
          </button>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              for="category-filter"
              class="mb-2 block text-xs font-semibold text-slate-600"
            >
              Categoría
            </label>

            <select
              id="category-filter"
              v-model="selectedCategory"
              :disabled="loadingCategories"
              class="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-slate-50"
              @change="handleFilterChange"
            >
              <option value="">
                Todas las categorías
              </option>

              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label
              for="status-filter"
              class="mb-2 block text-xs font-semibold text-slate-600"
            >
              Estado
            </label>

            <select
              id="status-filter"
              v-model="selectedStatus"
              class="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              @change="handleFilterChange"
            >
              <option value="">
                Todos los estados
              </option>

              <option value="OPEN">
                En curso
              </option>

              <option value="CLOSED">
                Finalizadas
              </option>

              <option value="NO_BIDS">
                Sin ofertas
              </option>

              <option value="CANCELLED">
                Canceladas
              </option>
            </select>
          </div>
        </div>
      </section>

      <section class="mt-9">
        <div class="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">
              Todas las subastas
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              <template v-if="!loadingAuctions">
                {{ total }} {{ total === 1 ? 'resultado encontrado' : 'resultados encontrados' }}
              </template>

              <template v-else>
                Consultando resultados...
              </template>
            </p>
          </div>
        </div>

        <LoadingState
          v-if="loadingAuctions"
          message="Cargando subastas..."
          min-height="320px"
        />

        <template v-else>
          <div
            v-if="auctions.length"
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
            title="No encontramos subastas"
            description="Prueba modificando los filtros para encontrar otras oportunidades."
          >
            <button
              type="button"
              class="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              @click="clearFilters"
            >
              Limpiar filtros
            </button>
          </EmptyState>

          <div
            v-if="totalPages > 1"
            class="mt-10 flex flex-col items-center gap-3"
          >
            <AppPagination
              v-model:page="page"
              :total-pages="totalPages"
            />

            <p class="text-xs text-slate-400">
              Página {{ page }} de {{ totalPages }}
            </p>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>