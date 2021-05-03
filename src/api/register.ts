import axios from 'axios'
import getMAC from 'macaddress'
import { setCredential } from '../common/credentialStore'
import logHTTPRequestError from '../utils/logHTTPRequestError'

export default async (host: string, secret: string): Promise<void> => {
  try {
    logger.info('Starting daemon registration process.')

    const response = await axios({
      method: 'POST',
      url: `${host}/api/v1/daemons/register`,
      headers: {
        'Content-Type': 'application/json',
        'X-Secret': secret
      },
      data: { mac: await getMAC.one() }
    })

    if (response.status === 200) {
      const { token } = response.data
      logger.info(`Daemon registered, received token ${token}. Saving in Credential Vault.`)
      setCredential('host', host) // Only store after we know the backend address was actually valid
      setCredential('token', token)
      logger.info('Daemon registration complete.')
    } else {
      // In case the backend returns some funky stuff (which it shouldn't be since any other 2xx or 3xx codes would be out-of-spec)
      throw new Error(`Received unexpected response code ${response.status} from backend. Cannot assume that registration completed successfully.`)
    }
  } catch (err) {
    if (err.response || err.request) logHTTPRequestError(err)

    logger.error(`Could not register daemon: ${err.stack}`)
    logger.error('Exiting...')
    process.exit(1)
  }
}
