import { userRepository } from '../../repository/userRepository.js'

export default class FetchUserUsecase {
  async execute (userId) {
    console.log(userId)

    if (!userId) {
      throw new Error('User id is required')
    }
    try {
      const user = await userRepository.findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (err) {
      console.error(err)

      throw new Error(err.message)
    }
  }
}
