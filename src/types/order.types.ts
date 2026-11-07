export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'EXPIRED'

export interface Order {
  id: string
  auctionId: string
  buyerId: string
  amount: number
  status: OrderStatus
  createdAt: string
  expiresAt: string
}

export interface PaymentCheckout {
  paymentId: string
  checkoutUrl: string
}

export interface OrderFilters {
  page?: number
  limit?: number
  status?: OrderStatus
}