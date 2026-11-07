export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
  name: string
  email: string
  token: string
}

export interface RegisteredUser {
  id: string
  name: string
  email: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}