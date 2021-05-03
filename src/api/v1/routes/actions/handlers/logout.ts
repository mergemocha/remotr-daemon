import { NextFunction, Response } from 'express'
import { logout } from '../../../../../os-shim'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import runGenericAction from '../../../runGenericAction'

export default (req: ExpressHandlerRequest, res: Response, next: NextFunction): void => runGenericAction('logout', logout, { req, res, next })
