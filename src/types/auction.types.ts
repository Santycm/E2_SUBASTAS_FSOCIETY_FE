export type AuctionStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'CANCELLED'
  | 'NO_BIDS'

export interface Auction {
  id: string
  title: string
  description: string
  categoryId: string
  sellerId: string
  basePrice: number
  minimumIncrement: number
  currentBid: number | null
  status: AuctionStatus
  closesAt: string
  createdAt: string
}

export interface CreateAuctionRequest {
  title: string
  description: string
  categoryId: string
  basePrice: number
  minimumIncrement: number
  closesAt: string
}

export interface AuctionFilters {
  categoryId?: string
  status?: AuctionStatus
  page?: number
  limit?: number
}