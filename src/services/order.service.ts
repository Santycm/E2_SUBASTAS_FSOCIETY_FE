import http from './http'
import type {
  Order,
  OrderFilters,
  PaymentCheckout,
} from '@/types/order.types'
import type { PaginatedResponse } from '@/types/pagination.types'

export const orderService = {
  async getAll(
    filters: OrderFilters = {},
  ): Promise<PaginatedResponse<Order>> {
    const response = await http.get<PaginatedResponse<Order>>(
      '/api/v1/orders',
      {
        params: filters,
      },
    )

    return response.data
  },

  async getSales(
    filters: OrderFilters = {},
  ): Promise<PaginatedResponse<Order>> {
    const response = await http.get<PaginatedResponse<Order>>(
      '/api/v1/orders/sales',
      {
        params: filters,
      },
    )

    return response.data
  },

  async getById(id: string): Promise<Order> {
    const response = await http.get<Order>(
      `/api/v1/orders/${id}`,
    )

    return response.data
  },

  async createPayment(id: string): Promise<PaymentCheckout> {
    const response = await http.post<PaymentCheckout>(
      `/api/v1/orders/${id}/payment`,
    )

    return response.data
  },
}