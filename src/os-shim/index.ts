import { WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH, WINDOWS_MAX_SHUTDOWN_TIMEOUT } from '../common/constants'
import execute from './commandExecutor'
import ShutdownCommandBuilder, { WindowsShutdownFlag } from './ShutdownCommandBuilder'

interface ShutdownOptions {
  force?: boolean
  timeout?: number
  comment?: string
}

/**
 * Validates that parameters in a {@link ShutdownOptions} object are within specification, throwing a RangeError if parameters are out of spec.
 * @see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown
 *
 * @param options - {@link ShutdownOptions}
 * @throws RangeError if parameters are out of spec.
 */
function validateOptions (options?: ShutdownOptions): void {
  // Validate timeout
  if (options?.timeout && (options.timeout < 0 || options.timeout > WINDOWS_MAX_SHUTDOWN_TIMEOUT)) {
    throw new RangeError(`Shutdown timeout cannot be lower than 0 seconds or greater than ${WINDOWS_MAX_SHUTDOWN_TIMEOUT} seconds, got ${options.timeout}`)
  }

  // Validate comment
  if (options?.comment && (options.comment.length > WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH)) {
    throw new RangeError(`Shutdown comment cannot be longer than ${WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH} characters, got ${WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH}`)
  }
}

/**
 * Ports a {@link ShutdownOptions} object to {@link WindowsShutdownFlag} objects through the {@link ShutdownCommandBuilder}.
 *
 * @param builder - {@link ShutdownCommandBuilder}
 * @param options - {@link ShutdownOptions}
 */
function portOptionsToFlags (builder: ShutdownCommandBuilder, options?: ShutdownOptions): void {
  validateOptions(options)

  if (options?.force) options.force ? builder.setFlag(WindowsShutdownFlag.FORCE) : builder.unsetFlag(WindowsShutdownFlag.FORCE)
  if (options?.timeout !== undefined) builder.setFlag(WindowsShutdownFlag.TIMEOUT, false, options.timeout) // Using explicit undefined check here so that empty strings and zeroes can pass through
  if (options?.comment) builder.setFlag(WindowsShutdownFlag.COMMENT, false, options.comment)
}

/**
 * Runs a pre-configured shutdown command.
 *
 * @param operation - {@link WindowsShutdownFlag}
 * @param options - {@link ShutdownOptions}
 */
async function runShutdownCommand (operation: WindowsShutdownFlag, options?: ShutdownOptions): Promise<void> {
  const builder = new ShutdownCommandBuilder()
  portOptionsToFlags(builder, options)

  builder.setFlag(operation, true)

  logger.info(`Executing ${builder.getCommandAsString()}.`)
  await execute(builder.BASE_COMMAND, builder.getArgs())
}

/**
 * Shuts down the host system.
 *
 * @param options - {@link ShutdownOptions}
 */
export async function shutdown (options?: ShutdownOptions): Promise<void> {
  await runShutdownCommand(WindowsShutdownFlag.SHUTDOWN, options)
}

/**
 * Reboots the host system.
 *
 * @param options - {@link ShutdownOptions}
 */
export async function reboot (options?: ShutdownOptions): Promise<void> {
  await runShutdownCommand(WindowsShutdownFlag.RESTART, options)
}

/**
 * Logs out the active user from the host system.
 *
 * @param options - {@link ShutdownOptions}
 */
export async function logout (options?: ShutdownOptions): Promise<void> {
  await runShutdownCommand(WindowsShutdownFlag.LOGOFF, options)
}

/**
 * Restarts (exits) the daemon. This relies on the program being run in a
 * context (I.e. a Windows service) that automatically restarts exited applications.
 */
export function restart (): void {
  // Exit the process; Windows will automatically restart it
  logger.warn('Restarting daemon.')
  process.exit(0)
}
