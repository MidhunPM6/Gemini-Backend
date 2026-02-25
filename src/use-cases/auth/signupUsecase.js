import { authRepository } from '../../repository/authRepository.js'

export default class SignupUseCase {
  async execute (userData) {
    if (!userData) {
      throw new Error('All fields are required')
    }

    try {
      const createUser = await authRepository.saveUser({
        mobile: userData.mobile
      })

      const response = {
        success: true,
        message: 'User created successfully',
        data: createUser
      }
      console.log(response)
      return response
    } catch (error) {
      console.error(error)

      throw new Error(error.message)
    }
  }
}
