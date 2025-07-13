import FetchUserUsecase from '../use-cases/user/fetchUserUsecase.js'
import StatusCodes from '../utils/statusCodes.js'

export const fetchUserController = async (req, res) => {
  const { id } = req.user
  try {
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User id is required' })
    }
    const fetchUserUsecase = new FetchUserUsecase()
    const response = await fetchUserUsecase.execute(id)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: 'User fetched successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}
