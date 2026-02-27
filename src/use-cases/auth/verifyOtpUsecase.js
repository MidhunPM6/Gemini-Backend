import { authRepository } from '../../repository/authRepository.js'
import { generateToken } from '../../utils/generateJwtToken.js'

export default class VerifyOtpUseCase {
  async execute (mobile, otp) {
    console.log('hhshshs:::::',mobile,otp)
    if (!mobile || !otp) {
      throw new Error('Mobile number and OTP are required')
    }
    try {
      const verifyOtp = await authRepository.verifyOtp(mobile, otp)
      

      const user = await authRepository.findUser({ mobile })
      if (!user) {
        throw new Error('User not found')
      }

      const token = generateToken(user)
      console.log(token)

      const response = {
        success: true,
        message: 'Otp verified successfully',
        data: token
      }

      return response
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
