import { prisma } from '../lib/prisma'
import { tradingEngine } from './trading-engine.service'
import { priceFeedService } from './price-feed.service'
import { GameModeActionType, PositionStatus } from '../types/enums'

class GameModeService {
  async forceClosePositions(targetUserId: string, outcome: 'WIN' | 'LOSS', amount: number, adminId: string) {
    const positions = await prisma.position.findMany({
      where: { userId: targetUserId, status: 'OPEN' satisfies PositionStatus },
    })
    for (const position of positions) {
      const profit = outcome === 'WIN' ? Math.abs(amount) : -Math.abs(amount)
      await tradingEngine.closePosition(position.id, targetUserId, undefined, profit)
    }
    await prisma.gameModeAction.create({
      data: {
        adminId,
        action: outcome === 'WIN' ? 'FORCE_WIN' : 'FORCE_LOSS',
        parameters: JSON.stringify({ amount }),
      },
    })
  }

  async adjustPrice(symbol: string, pips: number, adminId: string) {
    const pip = 0.0001
    const delta = pips * pip
    priceFeedService.applyManualAdjustment(symbol, (s) => ({
      ...s,
      price: s.price + delta,
      bid: s.bid + delta,
      ask: s.ask + delta,
    }))
    await prisma.gameModeAction.create({
      data: {
        adminId,
        action: 'FORCE_PRICE',
        parameters: JSON.stringify({ symbol, pips }),
      },
    })
  }
}

export const gameModeService = new GameModeService()

