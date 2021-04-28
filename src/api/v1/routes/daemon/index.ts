/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import logout from './handlers/logout'
import reboot from './handlers/reboot'
import restart from './handlers/restart'
import shutdown from './handlers/shutdown'

const router = Router()

router.post('/logout', logout)
router.post('/reboot', reboot)
router.post('/restart', restart)
router.post('/shutdown', shutdown)

export default router
