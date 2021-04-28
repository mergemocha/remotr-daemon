// Required by https://github.com/joiful-ts/joiful#basic-usage
import 'reflect-metadata'

// Setup logger
import './common/logger'

import dotenv from 'dotenv-safe'
import express from 'express'
import helmet from 'helmet'
import v1Router from './api/v1/index'

function terminate (): void {
  logger.error('BOOT: Encountered fatal error during boot process. Exiting...')
  process.exit(1)
}

// We can't reliably use TLA (Top-Level Await) yet, so we have to fallback to an async IIFE
void (async () => {
  // Load configuration
  logger.info('BOOT: Loading configuration.')
  dotenv.config()
  logger.info('BOOT: Configuration loaded.')

  const app = express()

  // Parse bodies as JSON
  app.use(express.json())

  // Load Helmet
  app.use(helmet())

  // Apply routers
  app.use('/api/v1', v1Router)

  const host = process.env.SERVER_HOST
  const port = process.env.SERVER_PORT

  if (!host || !port || isNaN(parseInt(port))) {
    logger.error(`BOOT: SERVER_HOST and/or SERVER_PORT not defined correctly; expected string and number, got SERVER_HOST=${host} SERVER_PORT=${port}`)
    terminate()
    return // This is just here to satisfy TS since it doesn't know that this function just terminates the program
  }

  app.listen(parseInt(port), host, () => {
    logger.info(`BOOT: REST server listening on http://${host}:${port}.`)
    logger.info('BOOT: Startup complete.')
  })
})()
