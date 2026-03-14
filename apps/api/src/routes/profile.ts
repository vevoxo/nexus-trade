'use strict'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const registerProfileRoutes = (app: FastifyInstance) => {
  app.register((instance, _opts, done) => {
    instance.addHook('preHandler', instance.authenticate)

    instance.get('/profile', async (request) => {
      const user = await prisma.user.findUnique({
        where: { id: request.user.userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          leverage: true,
        },
      })
      return { data: user }
    })

    instance.put('/profile', async (request, reply) => {
      const schema = z.object({
        fullName: z.string().min(3).max(100).optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().optional(),
        leverage: z.number().int().min(1).max(1000).optional(),
      })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() })
      }
      const data: any = {}
      if (parsed.data.fullName) data.fullName = parsed.data.fullName
      if (parsed.data.email) data.email = parsed.data.email.toLowerCase()
      if (parsed.data.phoneNumber !== undefined) data.phoneNumber = parsed.data.phoneNumber
      if (parsed.data.leverage !== undefined) data.leverage = parsed.data.leverage

      if (Object.keys(data).length === 0) {
        return reply.status(400).send({ error: 'No fields to update' })
      }

      const updated = await prisma.user.update({
        where: { id: request.user.userId },
        data,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          leverage: true,
        },
      })
      return { data: updated }
    })

    done()
  })
}

