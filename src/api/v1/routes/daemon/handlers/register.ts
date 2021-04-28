import axios from 'axios'
import keytar from 'keytar'

const backendHost = 'localhost'
const backendPort = '3000'

export default function registerDaemon (): void {
  logger.info('Sending daemon registration request.')
  let token = 'token'
  axios
    .post('http://localhost:3000/api/v1/daemons/register', {
      headers: {
        'Content-Type': 'applicaton/json',
        'X-Secret': 'supersecret'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        logger.info(`Daemon registered, received token=${token}`)
        const response = JSON.parse(res.data)
        token = response.token

        if (typeof token === 'string') {
          logger.info(`Attempting to store token ${token} in Windows Credential Vault.`)
          keytar.setPassword('remotr-daemon', 'token', token)
            .then((res) => {
              logger.info(`Token stored successfully (service=remotr-daemon, account=token, token=${token}).`)
            })
            .catch((err) => {
              logger.warn(`Storing failed: ${err.stack}`)
            })
        }
      } else {
        logger.warn(`Request failed with stat: ${res.status}, ${res.statusText}`)
      }
    })
    .catch((err) => {
      console.log(err.response.data)
      console.log(err.response.status)
      logger.warn(`Request failed: ${err.stack}`)
    })
}
