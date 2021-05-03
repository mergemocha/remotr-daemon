import { NextFunction, Response } from 'express'
import { reboot } from '../../../../../os-shim'
import { ExpressHandlerRequest } from '../../../../../types/ExpressHandlerRequest'
import runGenericAction from '../../../runGenericAction'

export default (req: ExpressHandlerRequest, res: Response, next: NextFunction): void => runGenericAction('reboot', reboot, { req, res, next })
