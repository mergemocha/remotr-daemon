import yargs from 'yargs'
import deregister from '../../api/deregister'
import { hasCredential } from '../../common/credentialStore'
import { uninstallService } from '../../utils/windowsServiceManager'
import { parseCLIArgs } from '../utils'

export default async (args: yargs.Argv, options?: { failIfAlreadyDone?: boolean, needsArgs?: boolean }): Promise<void> => {
  if (options?.needsArgs) parseCLIArgs(args)

  if (options?.failIfAlreadyDone && (!hasCredential('host') || !hasCredential('host'))) {
    logger.warn('Daemon is already de-registered.')
    process.exit(1)
  }

  await deregister()

  try {
    const wasUninstalled = await uninstallService()
    if (options?.failIfAlreadyDone && !wasUninstalled) process.exit(1)
  } catch (err) {
    logger.error(`Could not uninstall Windows service: ${err.stack}`)
  }
}
