// Required by https://github.com/joiful-ts/joiful#basic-usage
import 'reflect-metadata'

// Setup logger
import './common/logger'

import express from 'express'
import helmet from 'helmet'
import cli from './cli'
import v1Router from './api/v1/index'
import { getCredential } from './common/credentialStore'
import identify from './api/identify'

// Leaving this here, we might still need this
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function terminate (): void {
  logger.error('BOOT: Encountered fatal error during boot process. Exiting...')
  process.exit(1)
}

void (async () => {
  // Run CLI before startup
  await cli()

  // Make sure we're configured before starting
  if (await getCredential('token') === null || await getCredential('host') === null) {
    logger.error('BOOT: Attempted to boot, but daemon has not been configured yet.')
    terminate()
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

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.listen(63636, 'localhost', async () => {
    logger.info('BOOT: REST server listening on http://localhost:63636.')
    logger.info('BOOT: Identifying with backend.')
    await identify()
    logger.info('BOOT: Startup complete.')
  })
})()
