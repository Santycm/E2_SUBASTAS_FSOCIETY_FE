<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  page: number
  totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:page': [page: number]
  change: [page: number]
}>()

const pages = computed(() => {
  const total = Math.max(0, props.totalPages)
  const current = Math.min(Math.max(1, props.page), Math.max(1, total))

  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else if (end === total) {
      start = Math.max(1, end - 4)
    }
  }

  return Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  )
})

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.page) {
    return
  }

  emit('update:page', page)
  emit('change', page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-1.5"
    aria-label="Paginación"
  >
    <button
      type="button"
      class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="page <= 1"
      aria-label="Página anterior"
      @click="goToPage(page - 1)"
    >
      <ChevronLeft :size="18" />
    </button>

    <button
      v-for="pageNumber in pages"
      :key="pageNumber"
      type="button"
      class="size-9 rounded-lg text-sm font-semibold transition-colors"
      :class="pageNumber === page
        ? 'bg-primary-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'"
      :aria-current="pageNumber === page ? 'page' : undefined"
      @click="goToPage(pageNumber)"
    >
      {{ pageNumber }}
    </button>

    <button
      type="button"
      class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="page >= totalPages"
      aria-label="Página siguiente"
      @click="goToPage(page + 1)"
    >
      <ChevronRight :size="18" />
    </button>
  </nav>
</template>