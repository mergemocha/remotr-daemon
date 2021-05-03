import yargs from 'yargs'
import register from '../../api/register'
import { parseCLIArgs } from '../utils'

export default async (args: yargs.Argv): Promise<void> => {
  const { argv } = parseCLIArgs(args)
  await register(argv.h as string, argv.s as string)
}
