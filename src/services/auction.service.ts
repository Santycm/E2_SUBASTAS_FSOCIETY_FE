import http from './http'
import type {
  Auction,
  AuctionFilters,
  CreateAuctionRequest,
} from '@/types/auction.types'
import type { PaginatedResponse } from '@/types/pagination.types'

export const auctionService = {
  async getAll(
    filters: AuctionFilters = {},
  ): Promise<PaginatedResponse<Auction>> {
    const response = await http.get<PaginatedResponse<Auction>>(
      '/api/v1/auctions',
      {
        params: filters,
      },
    )

    return response.data
  },

  async getById(id: string): Promise<Auction> {
    const response = await http.get<Auction>(
      `/api/v1/auctions/${id}`,
    )

    return response.data
  },

  async create(data: CreateAuctionRequest): Promise<Auction> {
    const response = await http.post<Auction>(
      '/api/v1/auctions',
      data,
    )

    return response.data
  },

  async cancel(id: string): Promise<Auction> {
    const response = await http.patch<Auction>(
      `/api/v1/auctions/${id}/cancel`,
    )

    return response.data
  },
}