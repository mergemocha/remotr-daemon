import { createLogger, transports, format } from 'winston'
import TransportStream from 'winston-transport'
import WindowsEventLogTransport from './WindowsEventLogTransport'

const isDev = process.env.NODE_ENV === 'development'

const logTransports: TransportStream[] = [
  new transports.Console({ format: format.combine(format.simple(), format.colorize()) })
]

if (!isDev) logTransports.push(new WindowsEventLogTransport({ source: 'remotr-daemon', format: format.uncolorize() }))

global.logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: format.combine(format.simple(), format.colorize()),
  transports: logTransports
})
