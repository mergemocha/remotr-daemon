import { Router } from 'express'
import { header, body } from 'express-validator'
import { WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH, WINDOWS_MAX_SHUTDOWN_TIMEOUT } from '../../../../common/constants'
import logout from './handlers/logout'
import reboot from './handlers/reboot'
import restart from './handlers/restart'
import shutdown from './handlers/shutdown'

const router = Router()

const requiredParams = [
  header('Authorization').notEmpty().withMessage('Authorization header must be present'),
  body('force').isBoolean().toBoolean(true).withMessage('Must be true or false'),
  body('timeout').isInt({ min: 0, max: WINDOWS_MAX_SHUTDOWN_TIMEOUT }).withMessage('Must be in range 0-315360000'),
  body('comment').isLength({ max: WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH }).withMessage('Must be <= 512 characters')
]

router.post('/logout', ...requiredParams, logout)
router.post('/reboot', ...requiredParams, reboot)
router.post('/restart', ...requiredParams, restart)
router.post('/shutdown', ...requiredParams, shutdown)

export default router
