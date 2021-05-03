import yargs from 'yargs'
import deregister from '../../api/deregister'
import { hasCredential } from '../../common/credentialStore'
import { parseCLIArgs } from '../utils'

export default async (args: yargs.Argv, options?: { failIfAlreadyDone?: boolean, needsArgs?: boolean }): Promise<void> => {
  if (options?.needsArgs) parseCLIArgs(args)

  if (options?.failIfAlreadyDone && (!hasCredential('host') || !hasCredential('host'))) {
    logger.warn('Daemon is already de-registered.')
    process.exit(1)
  }

  await deregister()

  // TODO: Service removal code
}
