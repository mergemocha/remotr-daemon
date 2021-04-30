import axios from 'axios'
import getMAC from 'macaddress'
import { deleteCredential, getCredential } from '../common/credentialStore'
import logHTTPRequestError from '../utils/logHTTPRequestError'

export default async (): Promise<void> => {
  try {
    logger.info('Starting daemon deregistration process.')

    const host = await getCredential('host')
    const token = await getCredential('token')

    const mac = await getMAC.one()

    const response = await axios({
      method: 'DELETE',
      url: `${host}/api/v1/daemons/${mac}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      data: {}
    })

    if (response.status === 200) {
      logger.info('Daemon deregistered, removing stored credentials from Credential Vault.')
      await deleteCredential('host')
      await deleteCredential('token')
      logger.info('Daemon deregistration complete.')
    } else {
      // In case the backend returns some funky stuff (which it shouldn't be since any other 2xx or 3xx codes would be out-of-spec)
      throw new Error(`Received unexpected response code ${response.status} from backend. Cannot assume that deregistration completed successfully.`)
    }
  } catch (err) {
    if (err.response || err.request) logHTTPRequestError(err)

    logger.error(`Could not deregister daemon: ${err.stack}`)
    logger.error('Exiting...')
    process.exit(1)
  }
}
