import http from './http'
import type {
  Bid,
  BidResult,
  CreateBidRequest,
} from '@/types/bid.types'

export const bidService = {
  async getAll(auctionId: string): Promise<Bid[]> {
    const response = await http.get<Bid[]>(
      `/api/v1/auctions/${auctionId}/bids`,
    )

    return response.data
  },

  async create(
    auctionId: string,
    data: CreateBidRequest,
  ): Promise<BidResult> {
    const response = await http.post<BidResult>(
      `/api/v1/auctions/${auctionId}/bids`,
      data,
    )

    return response.data
  },
}