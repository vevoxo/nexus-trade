import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { PositionStatus } from '../types/enums'
import { z } from 'zod'

export const registerAccountRoutes = (app: FastifyInstance) => {
  app.register((instance, _, done) => {
    instance.addHook('preHandler', instance.authenticate)

    instance.get('/account/summary', async (request) => {
      const user = await prisma.user.findUnique({
        where: { id: request.user.userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          balance: true,
          equity: true,
          freeMargin: true,
          margin: true,
          marginLevel: true,
          leverage: true,
        },
      })
      return {
        data: user && {
          ...user,
          balance: Number(user.balance),
          equity: Number(user.equity),
          freeMargin: Number(user.freeMargin),
          margin: Number(user.margin),
          marginLevel: Number(user.marginLevel),
        },
      }
    })

    instance.get('/account/positions/open', async (request) => {
      const positions = await prisma.position.findMany({
        where: { userId: request.user.userId, status: 'OPEN' satisfies PositionStatus },
        orderBy: { openedAt: 'desc' },
      })
      return {
        data: positions.map((pos) => ({
          ...pos,
          lotSize: Number(pos.lotSize),
          openPrice: Number(pos.openPrice),
          currentPrice: Number(pos.currentPrice),
          stopLoss: pos.stopLoss ? Number(pos.stopLoss) : null,
          takeProfit: pos.takeProfit ? Number(pos.takeProfit) : null,
          marginUsed: Number(pos.marginUsed),
          swap: Number(pos.swap),
          commission: Number(pos.commission),
          profit: Number(pos.profit),
        })),
      }
    })

    instance.get('/account/positions/closed', async (request) => {
      const positions = await prisma.closedTrade.findMany({
        where: { userId: request.user.userId },
        orderBy: { closedAt: 'desc' },
        take: 100,
      })
      return {
        data: positions.map((pos) => ({
          ...pos,
          lotSize: Number(pos.lotSize),
          openPrice: Number(pos.openPrice),
          closePrice: Number(pos.closePrice),
          profit: Number(pos.profit),
          swap: Number(pos.swap),
          commission: Number(pos.commission),
        })),
      }
    })

    instance.get('/account/transactions', async (request) => {
      const tx = await prisma.transaction.findMany({
        where: { userId: request.user.userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      return {
        data: tx.map((t) => ({
          ...t,
          amount: Number(t.amount),
          balanceBefore: Number(t.balanceBefore),
          balanceAfter: Number(t.balanceAfter),
        })),
      }
    })

    instance.post('/account/deposit-request', async (request, reply) => {
      const schema = z.object({
        amount: z.number().min(10),
        note: z.string().optional(),
      })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() })
      }
      const requestRecord = await prisma.depositRequest.create({
        data: {
          userId: request.user.userId,
          amount: parsed.data.amount,
          note: parsed.data.note,
        },
      })
      return { data: requestRecord }
    })

    done()
  })
}

