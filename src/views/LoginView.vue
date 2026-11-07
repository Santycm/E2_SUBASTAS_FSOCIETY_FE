<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { Gavel, LogIn } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const submitting = ref(false)

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message

    if (message === 'INVALID_CREDENTIALS') {
      return 'El correo electrónico o la contraseña son incorrectos.'
    }

    if (message === 'VALIDATION_ERROR') {
      return 'Verifica los datos ingresados e inténtalo nuevamente.'
    }
  }

  return 'No fue posible iniciar sesión. Inténtalo nuevamente.'
}

async function handleSubmit() {
  if (!email.value.trim() || !password.value) {
    toast.error('Completa todos los campos.')
    return
  }

  submitting.value = true

  try {
    await authStore.login({
      email: email.value.trim(),
      password: password.value,
    })

    toast.success('¡Bienvenido! Has iniciado sesión correctamente.')

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''

    const destination = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'

    await router.replace(destination)
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
          <div
            class="flex size-12 items-center justify-center rounded-2xl bg-primary-600 text-white"
          >
            <Gavel :size="25" />
          </div>
          <span class="text-2xl font-extrabold tracking-tight text-slate-900">
            Subasta<span class="text-primary-600">Ya</span>
          </span>
        </RouterLink>

        <h1 class="mt-7 text-3xl font-extrabold tracking-tight text-slate-900">
          ¡Qué bueno tenerte de vuelta!
        </h1>

        <p class="mt-2 text-sm text-slate-500">Inicia sesión para participar en las subastas.</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form class="space-y-5" @submit.prevent="handleSubmit">
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
            placeholder="Ingresa tu contraseña"
            autocomplete="current-password"
            required
            :disabled="submitting"
          />

          <AppButton type="submit" size="lg" block :loading="submitting">
            <LogIn :size="18" />
            Iniciar sesión
          </AppButton>
        </form>

        <div class="my-6 border-t border-slate-100" />

        <p class="text-center text-sm text-slate-600">
          ¿Todavía no tienes una cuenta?
          <RouterLink to="/registro" class="font-semibold text-primary-700 hover:text-primary-800">
            Regístrate aquí
          </RouterLink>
        </p>
      </div>

      <p class="mt-6 text-center text-xs text-slate-400">
        Al iniciar sesión podrás publicar subastas, realizar ofertas y gestionar tus compras.
      </p>
    </div>
  </section>
</template>
