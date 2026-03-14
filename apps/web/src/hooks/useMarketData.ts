'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

const fallbackSymbols: MarketSymbol[] = [
  // Forex
  { symbol: 'EURUSD', price: 1.1023, bid: 1.1022, ask: 1.1024, spread: 0.0002, changePercent: 0.12 },
  { symbol: 'GBPUSD', price: 1.2791, bid: 1.2790, ask: 1.2792, spread: 0.0002, changePercent: -0.05 },
  { symbol: 'USDJPY', price: 151.34, bid: 151.33, ask: 151.35, spread: 0.02, changePercent: 0.08 },
  { symbol: 'AUDUSD', price: 0.665, bid: 0.6649, ask: 0.6651, spread: 0.0002, changePercent: 0.15 },
  { symbol: 'EURNOK', price: 11.25, bid: 11.248, ask: 11.252, spread: 0.004, changePercent: 0.18 },
  { symbol: 'USDQAR', price: 3.64, bid: 3.639, ask: 3.641, spread: 0.002, changePercent: 0.05 },
  { symbol: 'USDMXN', price: 17.0, bid: 16.99, ask: 17.01, spread: 0.02, changePercent: 0.12 },
  // Crypto
  { symbol: 'BTCUSD', price: 68250, bid: 68240, ask: 68260, spread: 20, changePercent: 1.2 },
  { symbol: 'ETHUSD', price: 3450, bid: 3445, ask: 3455, spread: 10, changePercent: 0.8 },
  { symbol: 'SOLUSD', price: 110, bid: 109.95, ask: 110.05, spread: 0.1, changePercent: 2.5 },
  { symbol: 'XRPUSD', price: 0.62, bid: 0.6198, ask: 0.6202, spread: 0.0004, changePercent: 0.65 },
  // Commodities
  { symbol: 'XAUUSD', price: 2375.50, bid: 2375.25, ask: 2375.75, spread: 0.5, changePercent: 0.25 },
  { symbol: 'XAGUSD', price: 28.40, bid: 28.38, ask: 28.42, spread: 0.04, changePercent: 0.35 },
  { symbol: 'UKOIL', price: 79.20, bid: 79.18, ask: 79.22, spread: 0.04, changePercent: -0.20 },
  { symbol: 'USOIL', price: 76.50, bid: 76.48, ask: 76.52, spread: 0.04, changePercent: -0.15 },
  // Indices
  { symbol: 'SPX500', price: 5450, bid: 5448, ask: 5452, spread: 4, changePercent: 0.35 },
  { symbol: 'NAS100', price: 18750, bid: 18745, ask: 18755, spread: 10, changePercent: 0.42 },
  { symbol: 'DJI30', price: 39850, bid: 39840, ask: 39860, spread: 20, changePercent: 0.28 },
  { symbol: 'DAX40', price: 18800, bid: 18795, ask: 18805, spread: 10, changePercent: 0.38 },
  // Stocks
  { symbol: 'AAPL', price: 225.50, bid: 225.45, ask: 225.55, spread: 0.1, changePercent: 0.55 },
  { symbol: 'MSFT', price: 465.20, bid: 465.15, ask: 465.25, spread: 0.1, changePercent: 0.32 },
  { symbol: 'AMZN', price: 195.80, bid: 195.75, ask: 195.85, spread: 0.1, changePercent: 0.18 },
  { symbol: 'TSLA', price: 240.30, bid: 240.25, ask: 240.35, spread: 0.1, changePercent: -0.25 },
  { symbol: 'NVDA', price: 495.75, bid: 495.70, ask: 495.80, spread: 0.1, changePercent: 1.15 },
  { symbol: 'GOOGL', price: 145.60, bid: 145.55, ask: 145.65, spread: 0.1, changePercent: 0.48 },
  { symbol: 'META', price: 485.20, bid: 485.15, ask: 485.25, spread: 0.1, changePercent: 0.65 },
  { symbol: 'NFLX', price: 620, bid: 619.95, ask: 620.05, spread: 0.1, changePercent: 0.85 },
  { symbol: 'AMD', price: 165, bid: 164.95, ask: 165.05, spread: 0.1, changePercent: 1.25 },
]

// Base prices for all symbols (matching backend fallbackSeed)
const symbolBasePrices: Record<string, number> = {
  // Forex
  EURUSD: 1.102,
  GBPUSD: 1.279,
  USDJPY: 151.3,
  AUDUSD: 0.665,
  EURNOK: 11.25,
  USDQAR: 3.64,
  USDMXN: 17.0,
  // Crypto
  BTCUSD: 68250,
  ETHUSD: 3450,
  SOLUSD: 110,
  XRPUSD: 0.62,
  // Commodities
  XAUUSD: 2375,
  XAGUSD: 28.4,
  UKOIL: 79.2,
  USOIL: 76.5,
  // Indices
  SPX500: 5450,
  NAS100: 18750,
  DJI30: 39850,
  DAX40: 18800,
  // Stocks
  AAPL: 225,
  MSFT: 465,
  AMZN: 195,
  TSLA: 240,
  NVDA: 495,
  GOOGL: 145,
  META: 485,
  NFLX: 620,
  AMD: 165,
}

const generateFallbackCandles = (basePrice: number = 1.1): Candle[] => {
  const candles: Candle[] = []
  const now = Date.now()
  let price = basePrice
  
  for (let i = 200; i >= 0; i--) {
    const time = now - i * 60 * 1000 // 1 minute intervals going back
    const volatility = basePrice > 1000 ? 0.002 : basePrice > 10 ? 0.001 : 0.0001
    const drift = (Math.random() - 0.48) * volatility
    price += drift
    
    const open = price
    const change = (Math.random() - 0.5) * volatility * 2
    const close = open + change
    const high = Math.max(open, close) + Math.abs(Math.random() * volatility * 0.5)
    const low = Math.min(open, close) - Math.abs(Math.random() * volatility * 0.5)
    
    candles.push({ time, open, high, low, close })
    price = close
  }
  return candles
}

const fallbackCandles = generateFallbackCandles()

export type MarketSymbol = {
  symbol: string
  price: number
  bid: number
  ask: number
  spread: number
  changePercent: number
}

export type Candle = {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export const useMarketSymbols = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['market-symbols'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: MarketSymbol[] }>('/market/symbols')
      return response.data
    },
    refetchInterval: 60_000,
  })

  return {
    symbols: data ?? fallbackSymbols,
    isLoading,
    error,
  }
}

export const useCandles = (symbol: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['candles', symbol],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: Candle[] }>(`/market/candles?symbol=${symbol}`)
        return response.data
      } catch (err) {
        console.warn('Failed to fetch candles, using fallback:', err)
        // Generate fallback based on symbol's base price
        const basePrice = symbolBasePrices[symbol] ?? 1.1
        return generateFallbackCandles(basePrice)
      }
    },
    refetchInterval: 60_000,
    enabled: Boolean(symbol),
    retry: false,
  })

  const basePrice = symbol ? (symbolBasePrices[symbol] ?? 1.1) : 1.1
  const candles = data ?? (symbol ? generateFallbackCandles(basePrice) : fallbackCandles)
  
  return { candles, isLoading }
}

export const useOpenPositions = () => {
  const token = useAuthStore((state) => state.accessToken)
  const socket = useSharedSocket()
  const queryClient = useQueryClient()
  
  const { data, refetch } = useQuery({
    queryKey: ['positions-open'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: any[] }>('/account/positions/open', token ?? undefined)
      return response.data
    },
    enabled: !!token,
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  })

  // Listen for position updates from socket
  useEffect(() => {
    if (!socket || !token) return
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ['positions-open'] })
      refetch()
    }
    socket.on('position:update', handler)
    socket.on('orders:new', handler)
    return () => {
      socket.off('position:update', handler)
      socket.off('orders:new', handler)
    }
  }, [socket, token, queryClient, refetch])

  return { positions: data ?? [], refetch }
}

let sharedSocket: Socket | null = null

export const useSharedSocket = () => {
  const token = useAuthStore((state) => state.accessToken)
  const [socket, setSocket] = useState<Socket | null>(sharedSocket)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000'
    if (!sharedSocket) {
      sharedSocket = io(url)
    }
    const instance = sharedSocket
    if (token) {
      instance.emit('auth:join', token)
    }
    setSocket(instance)
    return () => {}
  }, [token])

  return socket
}

export const usePriceSocket = () => {
  const socket = useSharedSocket()
  const [snapshot, setSnapshot] = useState<MarketSymbol[]>([])

  useEffect(() => {
    if (!socket) return
    const handler = (payload: MarketSymbol[]) => setSnapshot(payload)
    socket.on('price:update', handler)
    return () => {
      socket.off('price:update', handler)
    }
  }, [socket])

  return { socket, snapshot }
}

export const useSymbolsWithSocket = () => {
  const { symbols } = useMarketSymbols()
  const { snapshot } = usePriceSocket()

  const merged = useMemo(() => {
    const map = new Map(symbols.map((s) => [s.symbol, s]))
    snapshot.forEach((s) => map.set(s.symbol, s))
    return Array.from(map.values())
  }, [symbols, snapshot])

  return merged.length > 0 ? merged : fallbackSymbols
}

export const useAccountSummary = () => {
  const token = useAuthStore((state) => state.accessToken)
  const socket = useSharedSocket()
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!socket) return
    const handler = (account: any) => {
      queryClient.setQueryData(['account-summary'], account)
    }
    socket.on('account:update', handler)
    return () => {
      socket.off('account:update', handler)
    }
  }, [socket, queryClient])

  const { data } = useQuery({
    queryKey: ['account-summary'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: any }>('/account/summary', token ?? undefined)
      return response.data
    },
    enabled: !!token,
    refetchInterval: 30_000,
  })
  return data
}

