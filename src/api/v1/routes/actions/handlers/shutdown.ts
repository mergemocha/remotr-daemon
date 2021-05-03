import { NextFunction, Response } from 'express'
import { shutdown } from '../../../../../os-shim'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import runGenericAction from '../../../runGenericAction'

export default (req: ExpressHandlerRequest, res: Response, next: NextFunction): void => runGenericAction('shutdown', shutdown, { req, res, next })
