import { NextFunction, Response } from 'express'
import { restart } from '../../../../../os-shim'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import runGenericAction from '../../../runGenericAction'

export default (req: ExpressHandlerRequest, res: Response, next: NextFunction): void => runGenericAction('restart', restart, { req, res, next })
