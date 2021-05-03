import path from 'path'
import fs from 'fs-extra'
import executeCommand from './commandExecutor'

/**
 * Ensures that required dependencies for this driver (winsw.exe and winsw.xml)
 * are present, terminating the process with exit code 1 if not. (As that would be a fatal error)
 */
function ensureDependencies (): void {
  const configPath = path.join(process.cwd(), 'winsw.xml')
  const winswPath = path.join(process.cwd(), 'winsw.exe')

  if (!fs.existsSync(configPath) || !fs.existsSync(winswPath)) {
    logger.error('Required components winsw.xml and/or winsw.exe not found. Please ensure your download came with these files.')
    process.exit(1)
  }
}

/**
 * Installs the Windows service for the program.
 *
 * @returns Boolean indicating whether installation succeeded (true when installed, false when already installed).
 * @throws Error if the service could not be uninstalled.
 */
export async function installService (): Promise<boolean> {
  ensureDependencies()

  logger.info('Configuring service...')

  // Write execution path to config
  const configPath = path.join(process.cwd(), 'winsw.xml')

  let serviceConfig = await fs.readFile(configPath, { encoding: 'utf-8' })
  serviceConfig = serviceConfig.replace('{{execPath}}', process.execPath)

  await fs.writeFile(configPath, serviceConfig)

  logger.info('Service configured. Installing service...')
  const result = await executeCommand('winsw', ['install'])

  if (result.stdout.includes('was installed successfully')) {
    logger.info('Service installed successfully.')
    return true
  } else if (result.stdout.includes('The specified service already exists')) {
    logger.warn('Service is already installed, not installing again.')
    return false
  } else {
    logger.error(`Received unexpected execution result from installation executor: ${JSON.stringify(result)}`)
    throw new Error('Unexpected execution result. There is likely additional logging output above.')
  }
}

/**
 * Uninstalls the Windows service for the program.
 *
 * @returns Boolean indicating whether uninstallation succeeded (true when uninstalled, false when already uninstalled).
 * @throws Error if the service could not be uninstalled.
 */
export async function uninstallService (): Promise<boolean> {
  ensureDependencies()

  logger.info('Uninstalling service...')

  const result = await executeCommand('winsw', ['uninstall'])

  if (result.stdout.includes('was uninstalled successfully')) {
    logger.info('Service uninstalled successfully.')
    return true
  } else if (result.stdout.includes('does not exist')) {
    logger.warn('Service is already uninstalled, not uninstalling again.')
    return false
  } else {
    logger.error(`Received unexpected execution result from uninstallation executor: ${JSON.stringify(result)}`)
    throw new Error('Unexpected execution result. There is likely additional logging output above.')
  }
}

/**
 * Starts the Windows service for the program.
 *
 * @returns Boolean indicating whether start succeeded (true when started, false when already started).
 * @throws Error if the service could not be started.
 */
export async function startService (): Promise<boolean> {
  ensureDependencies()

  logger.info('Starting service...')

  const result = await executeCommand('winsw', ['start'])

  if (result.stdout.includes('started successfully')) {
    logger.info('Service started successfully.')
    return true
  } else if (result.stdout.includes('has already started')) {
    logger.info('Service is already running, not starting again.')
    return true
  } else {
    logger.error(`Received unexpected execution result from start executor: ${JSON.stringify(result)}`)
    throw new Error('Unexpected execution result. There is likely additional logging output above.')
  }
}

/**
 * Stops the Windows service for the program.
 *
 * @returns Boolean indicating whether stop succeeded (true when stopped, false when already stopped).
 * @throws Error if the service could not be stopped.
 */
export async function stopService (): Promise<boolean> {
  ensureDependencies()

  logger.info('Stopping service...')

  const result = await executeCommand('winsw', ['stop'])

  if (result.stdout.includes('stopped successfully')) {
    logger.info('Service stopped successfully.')
    return true
  } else if (result.stdout.includes('has already stopped')) {
    logger.warn('Service is already stopped, not stopping again.')
    return true
  } else {
    logger.error(`Received unexpected execution result from stop executor: ${JSON.stringify(result)}`)
    throw new Error('Unexpected execution result. There is likely additional logging output above.')
  }
}
