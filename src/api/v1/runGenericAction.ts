import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../types/ExpressHandlerRequest'
import { internalServerError, ok } from '../../utils/cannedHTTPResponses'
import { ShutdownOptions } from '../../os-shim'
import requestWasValid from '../../utils/requestWasValid'

type OpFn = (options: ShutdownOptions) => void | Promise<void>

interface ExpressHandlerCtx {
  req: ExpressHandlerRequest
  res: Response
  next: NextFunction
}

export default (opName: string, opFn: OpFn, ctx: ExpressHandlerCtx): void => {
  const { req, res } = ctx

  if (!requestWasValid(req, res)) return

  try {
    logger.info(`Received ${opName} request.`)
    void opFn(req.body)
    ok(res)
  } catch (err) {
    logger.error(`Could not complete ${opName} request: ${err.stack}`)
    internalServerError(res, err.stack)
  }
}
