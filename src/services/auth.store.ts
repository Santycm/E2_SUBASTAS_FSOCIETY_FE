import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService } from '@/services/auth.service'
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(
    localStorage.getItem('token'),
  )

  const storedUser = localStorage.getItem('user')

  const user = ref<AuthUser | null>(
    storedUser ? JSON.parse(storedUser) : null,
  )

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(data: LoginRequest) {
    const response = await authService.login(data)

    token.value = response.token

    user.value = {
      id: response.id,
      name: response.name,
      email: response.email,
    }

    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  async function register(data: RegisterRequest) {
    return authService.register(data)
  }

  function logout() {
    token.value = null
    user.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
})