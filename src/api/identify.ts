import os from 'os'
import axios from 'axios'
import getMAC from 'macaddress'
import getInternalIP from 'internal-ip'
import { getCredential } from '../common/credentialStore'
import logHTTPRequestError from '../utils/logHTTPRequestError'

export default async (): Promise<void> => {
  try {
    logger.info('Attempting to identify with backend.')

    // These variables will always be defined since we check them on boot
    const host = await getCredential('host')
    const token = await getCredential('token')

    // Need to check whether we have an internal IP
    const ip = await getInternalIP.v4()
    if (!ip) throw new Error('Could not determine IP address; host is probably not connected to any networks.')

    const mac = await getMAC.one()
    const user = os.userInfo().username
    const hostname = os.hostname()

    logger.info(`Identifying with backend at ${host} with token ${token}: MAC=${mac}, IP=${ip}, user=${user}, hostname=${hostname}`)

    const response = await axios({
      method: 'POST',
      url: `${host}/api/v1/daemons/identify`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      data: { mac, ip, user, hostname }
    })

    if (response.status === 200) {
      logger.info('Daemon identification successful.')
    } else {
      // In case the backend returns some funky stuff (which it shouldn't be since any other 2xx or 3xx codes would be out-of-spec)
      throw new Error(`Received unexpected response code ${response.status} from backend. Cannot assume that identification completed successfully.`)
    }
  } catch (err) {
    if (err.response || err.request) logHTTPRequestError(err)

    logger.error(`Could not identify with backend: ${err.stack}`)
    logger.error('Exiting...')
    process.exit(1)
  }
}
