'use strict'

const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2')

async function main() {
  const prisma = new PrismaClient()
  const email = 'demo@nexus.trade'
  const password = 'password123'
  const passwordHash = await argon2.hash(password)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      status: 'ACTIVE',
      role: 'USER',
      balance: 100000,
      equity: 100000,
      freeMargin: 100000,
      margin: 0,
      marginLevel: 0,
    },
    create: {
      email,
      fullName: 'Demo User',
      passwordHash,
      status: 'ACTIVE',
      role: 'USER',
      balance: 100000,
      equity: 100000,
      freeMargin: 100000,
      margin: 0,
      marginLevel: 0,
      leverage: 100,
    },
  })

  console.log('Seeded demo user:', user.email)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

