// Required by https://github.com/joiful-ts/joiful#basic-usage
import 'reflect-metadata'

// Setup logger
import './common/logger'

import express from 'express'
import helmet from 'helmet'
import v1Router from './api/v1/index'

// Leaving this here, we might still need this
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function terminate (): void {
  logger.error('BOOT: Encountered fatal error during boot process. Exiting...')
  process.exit(1)
}

logger.info('BOOT: Starting up.')
logger.info(`BOOT: Running in ${process.env.NODE_ENV === 'development' ? 'development' : 'production'} mode.`)

const app = express()

// Parse bodies as JSON
app.use(express.json())

// Load Helmet
app.use(helmet())

// Apply routers
app.use('/api/v1', v1Router)

app.listen(63636, 'localhost', () => {
  logger.info('BOOT: REST server listening on http://localhost:63636.')
  logger.info('BOOT: Startup complete.')
})
