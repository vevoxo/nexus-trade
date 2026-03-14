'use strict'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { PositionStatus } from '../types/enums'

export const registerChatRoutes = (app: FastifyInstance) => {
  app.register((instance, _opts, done) => {
    instance.addHook('preHandler', instance.authenticate)

    const messageSelect = {
      id: true,
      userId: true,
      adminId: true,
      fromRole: true,
      content: true,
      createdAt: true,
      readAt: true,
    }

    instance.get('/chat/threads', async (request, reply) => {
      if (request.user.role === 'ADMIN') {
        // List latest message per user
        const latest = await prisma.message.findMany({
          orderBy: { createdAt: 'desc' },
          select: messageSelect,
          take: 200,
        })
        const grouped = Object.values(
          latest.reduce((acc: any, msg) => {
            const key = msg.userId
            if (!acc[key]) acc[key] = msg
            return acc
          }, {})
        )
        return { data: grouped }
      }
      // User: return their own thread
      const messages = await prisma.message.findMany({
        where: { userId: request.user.userId },
        orderBy: { createdAt: 'asc' },
        select: messageSelect,
      })
      return { data: messages }
    })

    instance.post('/chat/send', async (request, reply) => {
      const schema = z.object({
        content: z.string().min(1).max(2000),
      })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() })
      }
      const message = await prisma.message.create({
        data: {
          userId: request.user.userId,
          fromRole: 'USER',
          content: parsed.data.content,
        },
        select: messageSelect,
      })
      // Emit to all admins and the user
      app.io?.emit('chat:new', message)
      app.io?.to(request.user.userId).emit('chat:new', message)
      return { data: message }
    })

    // Admin fetch a specific user's thread
    instance.get('/chat/thread/:userId', async (request, reply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({ error: 'Admin only' })
      }
      const paramsSchema = z.object({ userId: z.string().min(1) })
      const params = paramsSchema.parse(request.params)
      const messages = await prisma.message.findMany({
        where: { userId: params.userId },
        orderBy: { createdAt: 'asc' },
        select: messageSelect,
      })
      return { data: messages }
    })

    instance.post('/chat/send-admin', async (request, reply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({ error: 'Admin only' })
      }
      const schema = z.object({
        userId: z.string().min(1),
        content: z.string().min(1).max(2000),
      })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() })
      }
      const message = await prisma.message.create({
        data: {
          userId: parsed.data.userId,
          adminId: request.user.userId,
          fromRole: 'ADMIN',
          content: parsed.data.content,
        },
        select: messageSelect,
      })
      app.io?.to(parsed.data.userId).emit('chat:new', message)
      app.io?.emit('chat:new-admin', message)
      return { data: message }
    })

    instance.post('/chat/read', async (request, reply) => {
      const schema = z.object({
        userId: z.string().min(1),
      })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() })
      }
      if (request.user.role !== 'ADMIN' && parsed.data.userId !== request.user.userId) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      await prisma.message.updateMany({
        where: {
          userId: parsed.data.userId,
          readAt: null,
          ...(request.user.role !== 'ADMIN' ? { fromRole: 'ADMIN' } : {}),
        },
        data: { readAt: new Date() },
      })
      return { success: true }
    })

    done()
  })
}

