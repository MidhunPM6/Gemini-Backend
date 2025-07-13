import express from 'express'
import { signupController, generateOtpController,verifyOtpController,forgotPasswordController,changePasswordController } from '../controllers/authController.js'
import { verifyOptionalJwtToken } from '../middlewares/verifyOptionalJwtToken.js'




const router = express.Router()

router.post('/auth/signup',signupController)
router.post('/auth/send-otp', generateOtpController)
router.post('/auth/verify-otp', verifyOtpController)
router.post('/auth/forgot-password', forgotPasswordController)
router.post('/auth/change-password',verifyOptionalJwtToken, changePasswordController)



export default router