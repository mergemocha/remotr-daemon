import yargs from 'yargs'
import install from './handlers/install'
import uninstall from './handlers/uninstall'
import register from './handlers/register'
import deregister from './handlers/deregister'

export default async (): Promise<void> => {
  const args = yargs(process.argv.slice(2))
  const { argv } = args

  // Check if we got parameters passed; if not, exit here
  if (argv._.length > 0) {
    const command = argv._[0]

    switch (command) {
      case 'install': await install(args); break
      case 'uninstall': await uninstall(args, { failIfAlreadyDone: true }); break
      case 'reinstall':
        await uninstall(args, {
          failIfAlreadyDone: true,
          needsArgs: true
        })
        await install(args)
        break
      case 'register': await register(args); break
      case 'deregister': await deregister(args, { failIfAlreadyDone: true }); break
      case 'reregister':
        await deregister(args, {
          failIfAlreadyDone: true,
          needsArgs: true
        })
        await install(args)
        break
      default:
        console.log(`Unknown command ${command}; valid commands are [in|un|re]install, [de|re]register. Exiting.`)
    }

    // Exit after CLI completes
    process.exit(0)
  }
}
