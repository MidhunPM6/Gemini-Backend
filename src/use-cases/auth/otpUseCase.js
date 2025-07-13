import { authRepository } from '../../repository/authRepository.js'
import { generateOtp } from '../../utils/generateOtp.js'


export default class OtpUseCase {
  async execute (mobileNumber) {
    if (!mobileNumber) {
      throw new Error(' Mobile number is required')
    }
    try {
      const otp = generateOtp()
      if (!otp) {
        throw new Error('Otp not generated')
      }
      console.log("OTP generated",otp)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const saveOtp = await authRepository.saveOtp(mobileNumber, otp, expiresAt)

      const response = {
        success: true,
        message: 'Otp generated successfully',
        otp: otp
      }
      return response
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
