/* eslint-disable @typescript-eslint/no-misused-promises */

import { NextFunction, Response, Router } from 'express'
import { header, body } from 'express-validator'
import { ExpressHandlerRequest } from '../../../../types/ExpressHandlerRequest'
import logout from './handlers/logout'
import reboot from './handlers/reboot'
import restart from './handlers/restart'
import shutdown from './handlers/shutdown'

const WINDOWS_MAX_SHUTDOWN_TIMEOUT = 315360000
const WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH = 512
const router = Router()

router.post(
    '/logout',
    header('Authorization').notEmpty().withMessage('Authorization header must be present'),
    body('force').isBoolean().toBoolean(true).withMessage('Must be true or false'),
    body('timeout').isInt({ min: 0, max: WINDOWS_MAX_SHUTDOWN_TIMEOUT }).withMessage('Must be in range 0-315360000'),
    body('comment').isLength({ max: WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH }).withMessage('Must be <= 512 characters'),
    logout)

router.post(
    '/reboot',
    header('Authorization').notEmpty().withMessage('Authorization header must be present'),
    body('force').isBoolean().toBoolean(true).withMessage('Must be true or false'),
    body('timeout').isInt({ min: 0, max: WINDOWS_MAX_SHUTDOWN_TIMEOUT }).withMessage('Must be in range 0-315360000'),
    body('comment').isLength({ max: WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH }).withMessage('Must be <= 512 characters'),
    reboot)

router.post(
    '/restart',
    header('Authorization').notEmpty().withMessage('Authorization header must be present'),
    body('force').isBoolean().toBoolean(true).withMessage('Must be true or false'),
    body('timeout').isInt({ min: 0, max: WINDOWS_MAX_SHUTDOWN_TIMEOUT }).withMessage('Must be in range 0-315360000'),
    body('comment').isLength({ max: WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH }).withMessage('Must be <= 512 characters'),
    restart)

router.post(
    '/shutdown',
    header('Authorization').notEmpty().withMessage('Authorization header must be present'),
    body('force').isBoolean().toBoolean(true).withMessage('Must be true or false'),
    body('timeout').isInt({ min: 0, max: WINDOWS_MAX_SHUTDOWN_TIMEOUT }).withMessage('Must be in range 0-315360000'),
    body('comment').isLength({ max: WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH }).withMessage('Must be <= 512 characters'),
    shutdown)

export default router
