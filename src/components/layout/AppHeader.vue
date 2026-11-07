<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Gavel,
  Menu,
  X,
  UserRound,
  ShoppingBag,
  Store,
  Plus,
  LogIn,
  UserPlus,
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const route = useRoute()

const mobileMenuOpen = ref(false)

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5"
        @click="closeMobileMenu"
      >
        <div class="flex size-10 items-center justify-center rounded-xl bg-primary-600 text-white">
          <Gavel :size="22" :stroke-width="2.2" />
        </div>

        <div class="flex flex-col">
          <span class="text-lg font-extrabold tracking-tight text-slate-900">
            Subasta<span class="text-primary-600">Ya</span>
          </span>
          <span class="-mt-0.5 text-[10px] font-medium tracking-widest text-slate-400 uppercase">
            Marketplace
          </span>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          to="/"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          Inicio
        </RouterLink>

        <RouterLink
          to="/subastas"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="isActive('/subastas') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          Explorar subastas
        </RouterLink>

        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/publicar"
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="isActive('/publicar') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <Plus :size="16" />
          Publicar
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/mis-compras"
            class="rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="Mis compras"
            aria-label="Mis compras"
          >
            <ShoppingBag :size="19" />
          </RouterLink>

          <RouterLink
            to="/mis-ventas"
            class="rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="Mis ventas"
            aria-label="Mis ventas"
          >
            <Store :size="19" />
          </RouterLink>

          <RouterLink
            to="/mi-perfil"
            class="ml-1 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
          >
            <UserRound :size="17" />
            Mi perfil
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <LogIn :size="17" />
            Iniciar sesión
          </RouterLink>

          <RouterLink
            to="/registro"
            class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            <UserPlus :size="17" />
            Crear cuenta
          </RouterLink>
        </template>
      </div>

      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
        :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        :aria-expanded="mobileMenuOpen"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <X v-if="mobileMenuOpen" :size="22" />
        <Menu v-else :size="22" />
      </button>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
    >
      <nav class="mx-auto flex max-w-7xl flex-col gap-1">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-3 text-sm font-medium"
          :class="isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'"
          @click="closeMobileMenu"
        >
          Inicio
        </RouterLink>

        <RouterLink
          to="/subastas"
          class="rounded-lg px-3 py-3 text-sm font-medium"
          :class="isActive('/subastas') ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'"
          @click="closeMobileMenu"
        >
          Explorar subastas
        </RouterLink>

        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/publicar"
            class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="closeMobileMenu"
          >
            <Plus :size="17" />
            Publicar subasta
          </RouterLink>

          <RouterLink
            to="/mis-compras"
            class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="closeMobileMenu"
          >
            <ShoppingBag :size="17" />
            Mis compras
          </RouterLink>

          <RouterLink
            to="/mis-ventas"
            class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="closeMobileMenu"
          >
            <Store :size="17" />
            Mis ventas
          </RouterLink>

          <RouterLink
            to="/mi-perfil"
            class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="closeMobileMenu"
          >
            <UserRound :size="17" />
            Mi perfil
          </RouterLink>
        </template>

        <template v-else>
          <div class="my-2 border-t border-slate-100" />

          <RouterLink
            to="/login"
            class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="closeMobileMenu"
          >
            <LogIn :size="17" />
            Iniciar sesión
          </RouterLink>

          <RouterLink
            to="/registro"
            class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50"
            @click="closeMobileMenu"
          >
            <UserPlus :size="17" />
            Crear cuenta
          </RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>