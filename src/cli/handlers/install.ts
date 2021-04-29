import yargs from 'yargs'

export default (args: yargs.Argv): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { argv } = args
    .usage('Usage: $0 install -h http://localhost:3000 -s supersecret')
    .alias('h', 'host')
    .alias('s', 'secret')
    .demandOption(['h', 's'])

  // TODO: Implement
}
