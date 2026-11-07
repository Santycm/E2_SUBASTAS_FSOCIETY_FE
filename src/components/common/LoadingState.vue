<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'

interface Props {
  message?: string
  minHeight?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Cargando información...',
  minHeight: '240px',
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3"
    :style="{ minHeight }"
    role="status"
    aria-live="polite"
  >
    <LoaderCircle
      :size="30"
      class="animate-spin text-primary-600"
    />

    <p class="text-sm font-medium text-slate-500">
      {{ message }}
    </p>
  </div>
</template>