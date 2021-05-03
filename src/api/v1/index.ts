import express from 'express'
import rateLimit from 'express-rate-limit'
import actionRoutes from './routes/actions'

const router = express.Router()

// Global rate limit config
// Limit users to 50 reqs/s, which, outside of deliberate abuse, should never be triggered
router.use(rateLimit({
  max: 50,
  windowMs: 1000
}))

// Configure routes
router.use('/actions', actionRoutes)

export default router
