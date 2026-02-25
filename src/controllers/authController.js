import StatusCodes from '../utils/statusCodes.js'
import SignupUsecase from '../use-cases/auth/signupUsecase.js'
import OtpUseCase from '../use-cases/auth/otpUseCase.js'
import VerifyOtpUseCase from '../use-cases/auth/verifyOtpUsecase.js'
import ForgotPasswordUsecase from '../use-cases/auth/forgotPasswordUsecase.js'
import ChangePasswordUseCase from '../use-cases/auth/changePasswordUseCase.js'


export const signupController = async (req, res) => {
  const {  mobile } = req.body
  console.log(mobile);
  
  if (!mobile) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Required mobile number' })
  }
  const data = {
    mobile
  }
  try {
    const signupUsecase = new SignupUsecase()
    const response = await signupUsecase.execute(data)
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: response,
      message: 'User created successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const generateOtpController = async (req, res) => {
  const { mobile } = req.body
  if (!mobile) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Mobile number is required' })
  }
  try {
    const otpUseCase = new OtpUseCase()
    const response = await otpUseCase.execute(mobile)
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: response,
      message: 'Otp generated successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const verifyOtpController = async (req, res) => {
  const { mobile, userOtp } = req.body
  console.log(mobile,userOtp);
  
  if (!mobile || !userOtp) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Mobile number and OTP are required' })
  }
  try {
    const verifyOtpUseCase = new VerifyOtpUseCase()
    const response = await verifyOtpUseCase.execute(mobile, userOtp)

    res.cookie('token',response.data,{
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      
    })
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: response,
      message: 'Otp verified successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const forgotPasswordController = async (req, res) => {
  const { mobile } = req.body

  try {
    if (!mobile) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Mobile number is required' })
    }
    const forgotPasswordUseCase = new ForgotPasswordUsecase()
    const response = await forgotPasswordUseCase.execute(mobile)

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: response,
      message: 'Created new password successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const changePasswordController = async (req, res) => {
  if (req.user) {
    const { mobile, currentPassword, newPassword } = req.body
    if (!mobile || !currentPassword || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'All fields are required' })
    }
    try {
        const changePasswordUseCase = new ChangePasswordUseCase()
      const response = await changePasswordUseCase.changePassword(
        mobile,
        currentPassword,
        newPassword
      )
      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: response,
        message: 'Password changed successfully'
      })
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message })
    }
  } else {


    const { mobile, otp, newPassword } = req.body
    if (!mobile || !otp || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'All fields are required' })
    }
    try {
        const changePasswordUseCase = new ChangePasswordUseCase()
      const response = await changePasswordUseCase.forgotPassword(
        mobile,
        otp,
        newPassword
      )
      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: response,
        message: 'Password changed successfully'
      })
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message })
    }
  }
}


