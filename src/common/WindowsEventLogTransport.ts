import Transport, { TransportStreamOptions } from 'winston-transport'
import { EventLogConfig, EventLogger } from 'node-windows'

export default class WindowsEventLogTransport extends Transport {
  private readonly logger: EventLogger

  constructor (options: EventLogConfig & TransportStreamOptions) {
    // TODO: If this breaks either library by providing unknown parameters,
    // we may need to split them into separate constructor params
    super(options)
    this.logger = new EventLogger(options)
  }

  log (info: any, next: () => void): void {
    setImmediate(() => this.emit('logged', info))

    const { message, level } = info

    switch (level) {
      case 'fatal':
      case 'error':
        this.logger.error(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      default:
        // Putting this as the default condition since the Windows Event Log does not
        // recognise debug, silly etc. as log levels
        this.logger.info(message)
        break
    }

    next()
  }
}
