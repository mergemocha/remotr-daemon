import { Service } from 'node-windows'

const service = new Service({
  name: 'remotr-daemon',
  description: 'Remotr daemon software component',
  script: process.execPath,
  maxRestarts: 5
})

/**
 * Installs the program as a Windows service.
 *
 * @returns Boolean indicating whether install succeeded (true when installed, false when already installed)
 * and rejects with an error if the service could not be installed.
 */
export async function installService (): Promise<boolean> {
  // Having to do some manual Promise faffery here because node-windows operates with events for
  // service installations, and we don't have the results until then, hence why we need to manually
  // resolve the Promise
  return await new Promise((resolve, reject) => {
    try {
      service.on('install', () => {
        logger.info('Service installation successful.')
        resolve(true)
      })

      service.on('alreadyinstalled', () => {
        logger.warn('Service is already installed, not installing again.')
        resolve(false)
      })

      service.install()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Uninstalls the Windows service created for the program.
 *
 * @returns Boolean indicating whether uninstallation succeeded (true when uninstalled, false when already uninstalled)
 * and rejects with an error if the service could not be uninstalled.
 */
export async function uninstallService (): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    try {
      service.on('uninstall', () => {
        logger.info('Service uninstallation successful.')
        resolve(true)
      })

      service.on('alreadyuninstalled', () => {
        logger.warn('Service already uninstalled, not uninstalling again.')
        resolve(false)
      })

      service.uninstall()
    } catch (err) {
      reject(err)
    }
  })
}
