import { PassThrough } from 'stream'
import execa, { ExecaReturnValue } from 'execa'

interface ExecutionOptions {
  timeout?: number
}

/**
 * Executes arbitrary commands on the host system in a subprocess, piping their outputs to the global logger. If specified,
 * aborts execution after a specified time.
 *
 * @param command - The executable to run
 * @param string - An array of string arguments
 * @returns Execa process output
 */
export default async (command: string, args?: string[], options?: ExecutionOptions): Promise<ExecaReturnValue<string>> => {
  try {
    const subprocess = execa(command, args)

    if (options?.timeout) {
      setTimeout(subprocess.cancel, options.timeout)
    }

    // Setup passthrough streams for logging to act as middleware between stdout and Winston

    const logStreams = {
      stdout: new PassThrough(),
      stderr: new PassThrough()
    }

    logStreams.stdout.on('data', chunk => logger.info(`EXECUTOR: ${chunk}`))
    logStreams.stderr.on('data', chunk => logger.error(`EXECUTOR: ${chunk}`))

    subprocess.stdout?.pipe(logStreams.stdout)
    subprocess.stderr?.pipe(logStreams.stderr)

    return await subprocess
  } catch (err) {
    return err as ExecaReturnValue
  }
}
