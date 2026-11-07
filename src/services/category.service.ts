import http from './http'
import type {
  Category,
  CreateCategoryRequest,
} from '@/types/category.types'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await http.get<Category[]>(
      '/api/v1/categories',
    )

    return response.data
  },

  async getById(id: string): Promise<Category> {
    const response = await http.get<Category>(
      `/api/v1/categories/${id}`,
    )

    return response.data
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await http.post<Category>(
      '/api/v1/categories',
      data,
    )

    return response.data
  },
}