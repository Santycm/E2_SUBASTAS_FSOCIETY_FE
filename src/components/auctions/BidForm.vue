<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Gavel } from 'lucide-vue-next'

const props = defineProps<{
  minimumAmount: number
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [amount: number]
}>()

const amount = ref<number | null>(null)

const formattedMinimum = computed(() =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(props.minimumAmount),
)

const isValid = computed(() =>
  amount.value !== null &&
  Number.isInteger(amount.value) &&
  amount.value >= props.minimumAmount,
)

watch(
  () => props.minimumAmount,
  (value) => {
    if (amount.value !== null && amount.value < value) {
      amount.value = value
    }
  },
)

function submitBid() {
  if (!isValid.value || props.loading || props.disabled) return

  emit('submit', amount.value!)
}
</script>

<template>
  <form
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    @submit.prevent="submitBid"
  >
    <div class="mb-5 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Gavel :size="22" />
      </div>

      <div>
        <h3 class="text-lg font-bold text-slate-900">
          Realizar una oferta
        </h3>
        <p class="text-sm text-slate-500">
          Ingresa el valor que deseas ofertar.
        </p>
      </div>
    </div>

    <div class="mb-4">
      <label
        for="bid-amount"
        class="mb-2 block text-sm font-semibold text-slate-700"
      >
        Valor de tu oferta
      </label>

      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          COP
        </span>

        <input
          id="bid-amount"
          v-model.number="amount"
          type="number"
          min="1"
          step="1"
          placeholder="Ej. 150000"
          :disabled="disabled || loading"
          class="w-full rounded-xl border border-slate-300 py-3 pl-14 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>

      <p class="mt-2 text-sm text-slate-500">
        La oferta mínima permitida es
        <span class="font-semibold text-slate-700">
          {{ formattedMinimum }}
        </span>
      </p>

      <p
        v-if="amount !== null && !isValid"
        class="mt-2 text-sm text-red-600"
      >
        Ingresa un valor entero igual o superior al mínimo permitido.
      </p>
    </div>

    <button
      type="submit"
      :disabled="!isValid || disabled || loading"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Gavel v-if="!loading" :size="18" />

      <span>
        {{ loading ? 'Enviando oferta...' : 'Confirmar oferta' }}
      </span>
    </button>
  </form>
</template>