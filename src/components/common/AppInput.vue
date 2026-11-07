<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  hint?: string
  autocomplete?: string
  required?: boolean
  disabled?: boolean
  id?: string
  min?: string | number
  max?: string | number
  step?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
  hint: '',
  autocomplete: 'off',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const generatedId = useId()
const inputId = computed(() => props.id || generatedId)

const inputClasses = computed(() => [
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all',
  'placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
    : 'border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
])
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="mb-1.5 block text-sm font-semibold text-slate-700"
    >
      {{ label }}

      <span
        v-if="required"
        class="ml-0.5 text-red-500"
      >
        *
      </span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', $event)"
    />

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="mt-1.5 text-xs font-medium text-red-600"
    >
      {{ error }}
    </p>

    <p
      v-else-if="hint"
      :id="`${inputId}-hint`"
      class="mt-1.5 text-xs text-slate-500"
    >
      {{ hint }}
    </p>
  </div>
</template>