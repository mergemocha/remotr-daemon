import axios from 'axios'
import keytar from 'keytar'
import identifyDaemon from '../api/identify'

const backendHost = 'localhost'
const backendPort = '3000'

export default async (): Promise<void> => {
  try {
    logger.info('Sending daemon registration request.')
    const response = await axios({
      method: 'post',
      url: `http://${backendHost}:${backendPort}/api/v1/daemons/register`,
      headers: {
        'Content-Type': 'application/json',
        'X-Secret': 'supersecret'
      },
      data: {}
    })
    if (response.status === 200) {
      const { token } = response.data
      logger.info(`Daemon registered, received token=${token}`)

      if (typeof token === 'string') {
        logger.info(`Attempting to store token ${token} in Windows Credential Vault.`)
        try {
          await keytar.setPassword('remotr-daemon', 'token', token)
          logger.info(`Token stored successfully (service=remotr-daemon, account=token, token=${token}).`)
          void identifyDaemon()
        } catch (err) {
          logger.error(`An error occured while storing token. ${err.stack}`)
        }
      }
    }
  } catch (err) {
    logger.error(`${err.stack}: ${err.response?.data}`)
  }
}
