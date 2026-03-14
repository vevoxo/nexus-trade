'use strict'

const { PostgresInstance } = require('pg-embedded')

async function main() {
  const postgres = new PostgresInstance({
    port: 55432,
    username: 'nexus',
    password: 'nexus',
    persistent: true,
  })

  await postgres.start()
  const exists = await postgres.databaseExists('nexus_trade')
  if (!exists) {
    await postgres.createDatabase('nexus_trade')
  }

  const info = postgres.connectionInfo
  console.log(
    JSON.stringify(
      {
        connectionString: info.connectionString,
        host: info.host,
        port: info.port,
        username: info.username,
        database: 'nexus_trade',
      },
      null,
      2
    )
  )

  console.log('Embedded Postgres is running. Press Ctrl+C to stop.')
  process.stdin.resume()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

