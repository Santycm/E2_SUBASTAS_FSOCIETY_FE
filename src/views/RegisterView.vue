<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { UserPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { authService } from '@/services/auth.service'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitting = ref(false)

const passwordMismatch = computed(
  () => confirmPassword.value.length > 0 && password.value !== confirmPassword.value,
)

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message

    if (message === 'USER_ALREADY_EXISTS') {
      return 'Ya existe una cuenta registrada con ese correo electrónico.'
    }

    if (message === 'VALIDATION_ERROR') {
      return 'Algunos datos no cumplen con los requisitos. Verifica el formulario.'
    }
  }

  return 'No fue posible crear tu cuenta. Inténtalo nuevamente.'
}

async function handleSubmit() {
  const normalizedName = name.value.trim()
  const normalizedEmail = email.value.trim()

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    toast.error('El nombre debe tener entre 2 y 100 caracteres.')
    return
  }

  if (!normalizedEmail || !password.value) {
    toast.error('Completa todos los campos.')
    return
  }

  if (password.value.length < 8) {
    toast.error('La contraseña debe tener al menos 8 caracteres.')
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Las contraseñas no coinciden.')
    return
  }

  submitting.value = true

  try {
    await authService.register({
      name: normalizedName,
      email: normalizedEmail,
      password: password.value,
    })

    toast.success('Tu cuenta ha sido creada correctamente.')

    await router.replace({
      name: 'login',
      query: { email: normalizedEmail },
    })
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section
    class="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6"
  >
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2">
          <img src="/logo.svg" alt="FSOCIETY" class="size-12 object-contain" />

          <span class="text-2xl font-extrabold tracking-tight text-slate-900"> FSOCIETY </span>
        </RouterLink>

        <h1 class="mt-7 text-3xl font-extrabold tracking-tight text-slate-900">Crea tu cuenta</h1>

        <p class="mt-2 text-sm text-slate-500">Únete a FSOCIETY y comienza a participar.</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <AppInput
            v-model="name"
            label="Nombre completo"
            placeholder="Tu nombre"
            autocomplete="name"
            required
            :disabled="submitting"
            hint="Entre 2 y 100 caracteres."
          />

          <AppInput
            v-model="email"
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            autocomplete="email"
            required
            :disabled="submitting"
          />

          <AppInput
            v-model="password"
            label="Contraseña"
            type="password"
            placeholder="Crea una contraseña"
            autocomplete="new-password"
            required
            :disabled="submitting"
            hint="Debe tener al menos 8 caracteres."
          />

          <AppInput
            v-model="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            placeholder="Escribe nuevamente tu contraseña"
            autocomplete="new-password"
            required
            :disabled="submitting"
            :error="passwordMismatch ? 'Las contraseñas no coinciden.' : ''"
          />

          <AppButton
            type="submit"
            size="lg"
            block
            :loading="submitting"
            :disabled="passwordMismatch"
          >
            <UserPlus :size="18" />
            Crear cuenta
          </AppButton>
        </form>

        <div class="my-6 border-t border-slate-100" />

        <p class="text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta?
          <RouterLink to="/login" class="font-semibold text-primary-700 hover:text-primary-800">
            Inicia sesión
          </RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
