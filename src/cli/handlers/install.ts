import yargs from 'yargs'
import isAdmin from 'is-admin'
import register from '../../api/register'
import { parseCLIArgs } from '../utils'
import { installService } from '../../utils/windowsServiceManager'

export default async (args: yargs.Argv): Promise<void> => {
  const { argv } = parseCLIArgs(args)

  if (!(await isAdmin())) {
    logger.error('Installation of the Windows service requires administrative privileges. Please re-run this command from an administrative command prompt.')
    process.exit(1)
  }

  await register(argv.h as string, argv.s as string)

  try {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Running in development mode, not installing service. Please use the register command instead.')
    } else {
      await installService()
      logger.info('The Remotr daemon component is now installed. To start it, please run "net start remotr-daemon" in this terminal.')
    }
  } catch (err) {
    logger.error(`Could not install Windows service: ${err.stack}`)
    process.exit(1)
  }
}
