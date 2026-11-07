<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No hay resultados',
  description: 'No encontramos información para mostrar en este momento.',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
    <div class="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
      <Inbox :size="27" />
    </div>

    <h3 class="mt-4 text-base font-bold text-slate-800">
      {{ title }}
    </h3>

    <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
      {{ description }}
    </p>

    <div
      v-if="$slots.default"
      class="mt-5"
    >
      <slot />
    </div>
  </div>
</template>