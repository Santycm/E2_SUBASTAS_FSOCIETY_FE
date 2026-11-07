import { io, type Socket } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'

interface SocketError {
  message: string
}

interface AuctionSocketHandlers {
  onBidPlaced?: (event: unknown) => void
  onBidOutbid?: (event: unknown) => void
  onAuctionClosed?: (event: unknown) => void
  onSocketError?: (error: SocketError) => void
}

export function useAuctionSocket(
  auctionId: string,
  handlers: AuctionSocketHandlers = {},
) {
  const isConnected = ref(false)
  const isJoined = ref(false)

  let socket: Socket | null = null

  function handleJoined() {
    isJoined.value = true
  }

  function handleDisconnected() {
    isConnected.value = false
    isJoined.value = false
  }

  function handleBidPlaced(event: unknown) {
    handlers.onBidPlaced?.(event)
  }

  function handleBidOutbid(event: unknown) {
    handlers.onBidOutbid?.(event)
  }

  function handleAuctionClosed(event: unknown) {
    handlers.onAuctionClosed?.(event)
  }

  function handleSocketError(error: SocketError) {
    handlers.onSocketError?.(error)
  }

  onMounted(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      isConnected.value = true
      socket?.emit('JOIN_AUCTION', auctionId)
    })

    socket.on('disconnect', handleDisconnected)
    socket.on('JOINED_AUCTION', handleJoined)
    socket.on('BID_PLACED', handleBidPlaced)
    socket.on('BID_OUTBID', handleBidOutbid)
    socket.on('AUCTION_CLOSED', handleAuctionClosed)
    socket.on('SOCKET_ERROR', handleSocketError)

    socket.connect()
  })

  onUnmounted(() => {
    if (!socket) return

    socket.emit('LEAVE_AUCTION', auctionId)
    socket.disconnect()

    socket.off('connect')
    socket.off('disconnect', handleDisconnected)
    socket.off('JOINED_AUCTION', handleJoined)
    socket.off('BID_PLACED', handleBidPlaced)
    socket.off('BID_OUTBID', handleBidOutbid)
    socket.off('AUCTION_CLOSED', handleAuctionClosed)
    socket.off('SOCKET_ERROR', handleSocketError)

    socket = null
  })

  return {
    isConnected,
    isJoined,
  }
}