import { priceFeedService } from './price-feed.service'

export type MarketSymbol = {
  symbol: string
  price: number
  bid: number
  ask: number
  spread: number
  changePercent: number
}

class MarketService {
  getSymbols(): MarketSymbol[] {
    return priceFeedService.getSnapshot()
  }

  async getCandles(symbol: string) {
    return priceFeedService.getCandles(symbol)
  }
}

export const marketService = new MarketService()
