<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShieldCheck } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <RouterLink to="/" class="inline-flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="FSOCIETY"
            class="size-11 object-contain"
          />

          <span class="text-lg font-extrabold tracking-tight text-slate-900">
            FSOCIETY
          </span>
        </RouterLink>

        <p class="mt-4 max-w-xs text-sm leading-6 text-slate-500">
          Encuentra oportunidades, participa en subastas y consigue aquello que estás buscando.
        </p>
      </div>

      <div>
        <h3 class="text-sm font-bold text-slate-900">Explorar</h3>

        <div class="mt-4 flex flex-col items-start gap-3">
          <RouterLink
            to="/"
            class="text-sm text-slate-500 transition-colors hover:text-primary-600"
          >
            Inicio
          </RouterLink>

          <RouterLink
            to="/subastas"
            class="text-sm text-slate-500 transition-colors hover:text-primary-600"
          >
            Todas las subastas
          </RouterLink>

          <RouterLink
            to="/publicar"
            class="text-sm text-slate-500 transition-colors hover:text-primary-600"
          >
            Publicar una subasta
          </RouterLink>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-bold text-slate-900">Tu cuenta</h3>

        <div class="mt-4 flex flex-col items-start gap-3">
          <RouterLink
            to="/login"
            class="text-sm text-slate-500 transition-colors hover:text-primary-600"
          >
            Iniciar sesión
          </RouterLink>

          <RouterLink
            to="/registro"
            class="text-sm text-slate-500 transition-colors hover:text-primary-600"
          >
            Crear cuenta
          </RouterLink>

          <RouterLink
            to="/mi-perfil"
            class="text-sm text-slate-500 transition-colors hover:text-primary-600"
          >
            Mi perfil
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-100">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"
      >
        <p class="text-xs text-slate-400">
          © {{ currentYear }} FSOCIETY. Todos los derechos reservados.
        </p>

        <div class="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck :size="15" />
          Plataforma de subastas en línea
        </div>
      </div>
    </div>
  </footer>
</template>
