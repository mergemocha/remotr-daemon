import { NextFunction, Response } from 'express'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import { badRequest, internalServerError, ok } from '../../../../../utils/cannedHTTPResponses'

// TODO

export default async (req: ExpressHandlerRequest, res: Response, next: NextFunction): Promise<void> => {
  // logger.info()
  try {
    if (req) {
      // logger.info()
      ok(res)
    } else {
      // logger.warn()
      badRequest(res)
    }
  } catch (err) {
    // logger.warn()
    internalServerError(res)
  }
}
