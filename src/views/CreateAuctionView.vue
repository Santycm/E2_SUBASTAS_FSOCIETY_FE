
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Gavel, Info } from 'lucide-vue-next'
import { auctionService } from '@/services/auction.service'
import { categoryService } from '@/services/category.service'
import type { Category } from '@/types/category.types'
import type { CreateAuctionRequest } from '@/types/auction.types'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { formatCurrency } from '@/utils/currency'
import { toUtcISOString } from '@/utils/date'

const router = useRouter()

const categories = ref<Category[]>([])
const loadingCategories = ref(true)
const submitting = ref(false)

const errorMessage = ref('')
const validationErrors = ref<Record<string, string>>({})

const form = ref({
  title: '',
  description: '',
  categoryId: '',
  basePrice: '',
  minimumIncrement: '',
  closesAt: '',
})

const minimumClosingDate = computed(() => {
  const date = new Date(Date.now() + 60 * 60 * 1000)
  const offset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16)
})

const previewBasePrice = computed(() => {
  const amount = Number(form.value.basePrice)
  return amount > 0 ? formatCurrency(amount) : '$0'
})

const previewIncrement = computed(() => {
  const amount = Number(form.value.minimumIncrement)
  return amount > 0 ? formatCurrency(amount) : '$0'
})

async function loadCategories() {
  loadingCategories.value = true

  try {
    categories.value = await categoryService.getAll()
  } catch {
    errorMessage.value = 'No fue posible cargar las categorías. Intenta nuevamente.'
  } finally {
    loadingCategories.value = false
  }
}

function validateForm(): boolean {
  const errors: Record<string, string> = {}

  if (!form.value.title.trim()) {
    errors.title = 'El título es obligatorio.'
  } else if (form.value.title.trim().length < 5) {
    errors.title = 'El título debe tener al menos 5 caracteres.'
  }

  if (!form.value.description.trim()) {
    errors.description = 'La descripción es obligatoria.'
  } else if (form.value.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres.'
  }

  if (!form.value.categoryId) {
    errors.categoryId = 'Selecciona una categoría.'
  }

  const basePrice = Number(form.value.basePrice)
  const minimumIncrement = Number(form.value.minimumIncrement)

  if (!form.value.basePrice || !Number.isInteger(basePrice) || basePrice <= 0) {
    errors.basePrice = 'Ingresa un precio inicial válido en pesos colombianos.'
  }

  if (
    !form.value.minimumIncrement ||
    !Number.isInteger(minimumIncrement) ||
    minimumIncrement <= 0
  ) {
    errors.minimumIncrement = 'Ingresa un incremento mínimo válido.'
  }

  if (
    Number.isInteger(basePrice) &&
    Number.isInteger(minimumIncrement) &&
    minimumIncrement > 0 &&
    minimumIncrement >= basePrice
  ) {
    errors.minimumIncrement = 'El incremento debe ser inferior al precio inicial.'
  }

  if (!form.value.closesAt) {
    errors.closesAt = 'La fecha de cierre es obligatoria.'
  } else {
    const closingDate = new Date(form.value.closesAt).getTime()
    const minimumDate = Date.now() + 60 * 60 * 1000
    const maximumDate = Date.now() + 30 * 24 * 60 * 60 * 1000

    if (closingDate < minimumDate) {
      errors.closesAt = 'La subasta debe durar al menos una hora.'
    } else if (closingDate > maximumDate) {
      errors.closesAt = 'La subasta no puede durar más de 30 días.'
    }
  }

  validationErrors.value = errors

  return Object.keys(errors).length === 0
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = error.response

    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      const data = response.data

      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data
      ) {
        const message = data.message

        if (Array.isArray(message)) {
          return message.join(' ')
        }

        if (typeof message === 'string') {
          return message
        }
      }
    }
  }

  return 'No fue posible publicar la subasta. Intenta nuevamente.'
}

async function submitAuction() {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    const data: CreateAuctionRequest = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      categoryId: form.value.categoryId,
      basePrice: Number(form.value.basePrice),
      minimumIncrement: Number(form.value.minimumIncrement),
      closesAt: toUtcISOString(form.value.closesAt),
    }

    const auction = await auctionService.create(data)

    await router.push(`/subastas/${auction.id}`)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    submitting.value = false
  }
}

onMounted(loadCategories)
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-10">
    <button
      type="button"
      class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600"
      @click="router.back()"
    >
      <ArrowLeft :size="17" />
      Volver
    </button>

    <div class="mb-8">
      <div class="mb-3 flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <Gavel :size="23" />
        </div>

        <div>
          <h1 class="text-2xl font-bold text-slate-900">
            Publicar una subasta
          </h1>

          <p class="mt-0.5 text-sm text-slate-500">
            Completa la información para poner tu producto a subasta.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
      <form
        class="space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        @submit.prevent="submitAuction"
      >
        <div
          v-if="errorMessage"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div>
          <h2 class="text-base font-bold text-slate-900">
            Información del producto
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Describe claramente el producto que deseas subastar.
          </p>
        </div>

        <div class="space-y-5">
          <AppInput
            v-model="form.title"
            label="Título de la subasta"
            placeholder="Ej. Computador portátil Lenovo ThinkPad"
            required
            :error="validationErrors.title"
            :disabled="submitting"
          />

          <div>
            <label
              for="description"
              class="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Descripción
              <span class="ml-0.5 text-red-500">*</span>
            </label>

            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              placeholder="Describe el estado, características y detalles importantes del producto..."
              :disabled="submitting"
              class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-slate-50"
              :class="validationErrors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''"
            />

            <p
              v-if="validationErrors.description"
              class="mt-1.5 text-xs font-medium text-red-600"
            >
              {{ validationErrors.description }}
            </p>

            <p
              v-else
              class="mt-1.5 text-xs text-slate-500"
            >
              Incluye toda la información que pueda ayudar a los participantes.
            </p>
          </div>

          <div>
            <label
              for="category"
              class="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Categoría
              <span class="ml-0.5 text-red-500">*</span>
            </label>

            <select
              id="category"
              v-model="form.categoryId"
              :disabled="loadingCategories || submitting"
              class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-slate-50"
              :class="validationErrors.categoryId ? 'border-red-300' : ''"
            >
              <option value="" disabled>
                {{ loadingCategories ? 'Cargando categorías...' : 'Selecciona una categoría' }}
              </option>

              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>

            <p
              v-if="validationErrors.categoryId"
              class="mt-1.5 text-xs font-medium text-red-600"
            >
              {{ validationErrors.categoryId }}
            </p>

            <p
              v-else-if="!loadingCategories && categories.length === 0"
              class="mt-1.5 text-xs text-red-600"
            >
              No hay categorías disponibles.
            </p>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-7">
          <h2 class="text-base font-bold text-slate-900">
            Configuración de la subasta
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Define el precio inicial y las condiciones de las ofertas.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AppInput
            v-model="form.basePrice"
            label="Precio inicial (COP)"
            type="number"
            placeholder="100000"
            min="1"
            step="1"
            required
            hint="Valor mínimo para comenzar a ofertar."
            :error="validationErrors.basePrice"
            :disabled="submitting"
          />

          <AppInput
            v-model="form.minimumIncrement"
            label="Incremento mínimo (COP)"
            type="number"
            placeholder="10000"
            min="1"
            step="1"
            required
            hint="Aumento mínimo permitido entre ofertas."
            :error="validationErrors.minimumIncrement"
            :disabled="submitting"
          />
        </div>

        <div>
          <AppInput
            v-model="form.closesAt"
            label="Fecha y hora de cierre"
            type="datetime-local"
            :min="minimumClosingDate"
            required
            hint="La subasta debe durar entre una hora y 30 días."
            :error="validationErrors.closesAt"
            :disabled="submitting"
          />
        </div>

        <div class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <AppButton
            variant="outline"
            type="button"
            :disabled="submitting"
            @click="router.push('/subastas')"
          >
            Cancelar
          </AppButton>

          <AppButton
            type="submit"
            size="lg"
            :loading="submitting"
            :disabled="loadingCategories || categories.length === 0"
          >
            Publicar subasta
          </AppButton>
        </div>
      </form>

      <aside class="space-y-5">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-sm font-bold text-slate-900">
            Resumen de tu subasta
          </h2>

          <div class="mt-5 space-y-4">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                Producto
              </p>

              <p class="mt-1 break-words text-sm font-semibold text-slate-800">
                {{ form.title.trim() || 'Sin título' }}
              </p>
            </div>

            <div class="border-t border-slate-100 pt-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                Precio inicial
              </p>

              <p class="mt-1 text-lg font-bold text-slate-900">
                {{ previewBasePrice }}
              </p>
            </div>

            <div class="border-t border-slate-100 pt-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                Incremento mínimo
              </p>

              <p class="mt-1 text-sm font-semibold text-slate-800">
                {{ previewIncrement }}
              </p>
            </div>

            <div class="border-t border-slate-100 pt-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                Categoría
              </p>

              <p class="mt-1 text-sm font-semibold text-slate-800">
                {{ categories.find(category => category.id === form.categoryId)?.name || 'Sin seleccionar' }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div class="flex items-start gap-3">
            <Info
              :size="19"
              class="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <h3 class="text-sm font-semibold text-blue-900">
                Antes de publicar
              </h3>

              <p class="mt-1 text-xs leading-relaxed text-blue-800">
                Verifica que la descripción y los precios sean correctos.
                Una vez publicada, los participantes podrán comenzar a ofertar
                según las condiciones de la subasta.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
