import express from 'express'
import {
  signupController,
  generateOtpController,
  verifyOtpController
} from '../controllers/authController.js'


const router = express.Router()

router.post('/auth/signup', signupController)
router.post('/auth/send-otp', generateOtpController)
router.post('/auth/verify-otp', verifyOtpController)

export default router
