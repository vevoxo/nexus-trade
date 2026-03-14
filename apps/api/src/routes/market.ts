import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { marketService } from '../services/market.service'

export const registerMarketRoutes = (app: FastifyInstance) => {
  app.get('/market/symbols', async () => ({
    data: marketService.getSymbols()
  }))

  app.get('/market/candles', async (request, reply) => {
    const schema = z.object({ symbol: z.string().default('EURUSD') })
    const result = schema.safeParse(request.query)
    if (!result.success) {
      return reply.status(400).send({ error: 'Invalid symbol parameter' })
    }
    const data = await marketService.getCandles(result.data.symbol)
    return { data }
  })
}
