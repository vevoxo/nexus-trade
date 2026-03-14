import 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Server as SocketIOServer } from 'socket.io'

declare module 'fastify' {
  interface FastifyInstance {
    io?: SocketIOServer
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: {
      userId: string
      role: 'USER' | 'ADMIN'
      email: string
    }
  }
}
