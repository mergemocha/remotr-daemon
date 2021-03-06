import yargs from 'yargs'
import isAdmin from 'is-admin'
import deregister from '../../api/deregister'
import { hasCredential } from '../../common/credentialStore'
import { stopService, uninstallService } from '../../os-shim/windowsServiceDriver'
import { parseCLIArgs } from '../utils'

export default async (args: yargs.Argv, options?: { failIfAlreadyDone?: boolean, needsArgs?: boolean }): Promise<void> => {
  if (!(await isAdmin())) {
    logger.error('Installation of the Windows service requires administrative privileges. Please re-run this command from an administrative command prompt.')
    process.exit(1)
  }

  if (options?.needsArgs) parseCLIArgs(args)

  if (options?.failIfAlreadyDone && (!hasCredential('host') || !hasCredential('host'))) {
    logger.warn('Daemon is already de-registered.')
    process.exit(1)
  }

  await deregister()

  try {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Running in development mode, not uninstalling service. Please use the deregister command instead.')
    } else {
      await stopService()
      const wasUninstalled = await uninstallService()
      if (options?.failIfAlreadyDone && !wasUninstalled) process.exit(1)
    }
  } catch (err) {
    logger.error(`Could not uninstall Windows service: ${err.stack}`)
  }
}
