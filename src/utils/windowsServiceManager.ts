import path from 'path'
import fs from 'fs-extra'
import executeCommand from '../os-shim/commandExecutor'

function ensureDependencies (): void {
  const configPath = path.join(process.cwd(), 'winsw.xml')
  const winswPath = path.join(process.cwd(), 'winsw.exe')

  if (!fs.existsSync(configPath) || !fs.existsSync(winswPath)) {
    logger.error('Required components winsw.xml and/or winsw.exe not found. Please ensure your download came with these files.')
    process.exit(1)
  }
}

/**
 * Installs the program as a Windows service.
 *
 * @returns Boolean indicating whether install succeeded (true when installed, false when already installed)
 * and rejects with an error if the service could not be installed.
 */
export async function installService (): Promise<boolean> {
  ensureDependencies()

  logger.info('Configuring service...')

  // Write execution path to config
  const configPath = path.join(process.cwd(), 'winsw.xml')
  const serviceConfig = await fs.readFile(configPath, { encoding: 'utf-8' })
  serviceConfig.replace('{{execPath}}', process.execPath)
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
 * Uninstalls the Windows service created for the program.
 *
 * @returns Boolean indicating whether uninstallation succeeded (true when uninstalled, false when already uninstalled)
 * and rejects with an error if the service could not be uninstalled.
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
