import express from 'express'
import { signupController, generateOtpController } from '../controllers/authController.js'


const router = express.Router()

router.post('/auth/signup',signupController)
router.post('/auth/send-otp', generateOtpController)


export default router