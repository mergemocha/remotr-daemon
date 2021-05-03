import yargs from 'yargs'

/**
 * Parses command line arguments required by the application.
 *
 * @param args - {@link yargs.Argv}
 * @returns yargs.Argv object
 */
export function parseCLIArgs (args: yargs.Argv): yargs.Argv {
  return args
    .usage('Usage: $0 register -h http://localhost:3000 -s supersecret')
    .alias('h', 'host')
    .alias('s', 'secret')
    .describe({ h: 'Backend host', s: 'Server secret' })
    .demandOption(['h', 's'])
}
