import http from './http'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisteredUser,
} from '@/types/auth.types'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>(
      '/api/v1/auth/login',
      data,
    )

    return response.data
  },

  async register(data: RegisterRequest): Promise<RegisteredUser> {
    const response = await http.post<RegisteredUser>(
      '/api/v1/auth/register',
      data,
    )

    return response.data
  },
}