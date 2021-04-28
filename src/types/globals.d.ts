import winston from 'winston'

declare global {
  // eslint-disable-next-line no-var
  var logger: winston.Logger
}
