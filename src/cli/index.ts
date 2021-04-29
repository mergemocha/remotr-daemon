import yargs from 'yargs'
import install from './handlers/install'
import uninstall from './handlers/uninstall'
import register from './handlers/register'
import deregister from './handlers/deregister'

export default (): void => {
  const args = yargs(process.argv.slice(2))
  const { argv } = args

  // Check if we got parameters passed; if not, exit here
  if (argv._.length > 0) {
    const command = argv._[0]

    switch (command) {
      case 'install': install(args); break
      case 'uninstall': uninstall(args, true); break
      case 'reinstall':
        uninstall(args) // TODO: Make install (optionally?) not fail if already deregistered
        install(args)
        break
      case 'register': register(args); break
      case 'deregister': deregister(args, true); break
      case 'reregister':
        deregister(args) // TODO: Make deregister (optionally?) not fail if already deregistered
        install(args)
        break
      default:
        console.log(`Unknown command ${command}; valid commands are [in|un|re]install, [de|re]register. Exiting.`)
        process.exit(0)
    }
  }
}
