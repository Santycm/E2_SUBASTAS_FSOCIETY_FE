import type { PublicUser } from '@/types/user.types';
import http from './http'
import type { Auction } from '@/types/auction.types'

export interface UserProfile {
  id: string
  name: string
  email: string
  publishedAuctions: Auction[]
  participatedAuctions: Auction[]
}

export const userService = {
  async getMe(): Promise<UserProfile> {
    const response = await http.get<UserProfile>(
      '/api/v1/users/me',
    )

    return response.data
  },

  async getPublicProfile(userId: string): Promise<PublicUser> {
    const response = await http.get<PublicUser>(
      `/api/v1/users/${userId}/public`,
    )

    return response.data
  },
}