import axios from 'axios'
import keytar from 'keytar'

const backendHost = 'localhost'
const backendPort = '3000'

const mac = '69:04:EA:0B:FB:01'
const ip = '127.0.0.1'
const hostname = 'host'
const user = 'user1'

export default async (): Promise<void> => {
  try {
    logger.info('Token needed for daemon identification. Attempting to retrieve token.')
    const token = await keytar.getPassword('remotr-daemon', 'token')
    if (token !== null && typeof (token) === 'string') {
      logger.info(`Token retrieved successfully. Token is ${token}. Sending daemon identification request.`)
      try {
        const response = await axios({
          method: 'post',
          url: `http://${backendHost}:${backendPort}/api/v1/daemons/identify`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          data: {
            mac: mac,
            ip: ip,
            user: user,
            hostname: hostname
          }
        })
        if (response.status === 200) {
          logger.info(`Daemon identification successful. The following data was sent: MAC=${mac}, IP=${ip}, USER=${user}, HOSTNAME=${hostname}`)
        }
      } catch (err) {
        logger.error(`THIS IS AN ERROR${err.stack}: ${err.response?.data}`)
      }
    } else {
      logger.error(`Token should be type string and not null. Token was of type ${typeof (token)} and was ${token}`)
    }
  } catch (err) {
    logger.error(`An error occured while retrieving token. ${err.stack}`)
  }
}
