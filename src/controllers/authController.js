
import StatusCodes from '../utils/statusCodes.js'
import SignupUsecase from '../use-cases/auth/signupUsecase.js'
import OtpUseCase from '../use-cases/auth/otpUseCase.js'



export const signupController = async (req, res) => {
  const { name, email, password, mobile } = req.body
  if (!name || !email || !password || !mobile) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'All fields are required' })
  }
  const data = {
    name,
    email,
    password,
    mobile
  }
  try {
    const signupUsecase = new SignupUsecase()
    const response = await  signupUsecase.execute(data)
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, data:response, message: 'User created successfully' })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const generateOtpController =async(req, res)=>{
        const { mobile } = req.body 
        if (!mobile) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: 'Mobile number is required' })
        }
        try {
          const otpUseCase = new OtpUseCase()
          const response = await  otpUseCase.execute(mobile)
          return res
            .status(StatusCodes.CREATED)
            .json({ success: true, data:response, message: 'Otp generated successfully' })
        } catch (error) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: error.message })
        }
}
