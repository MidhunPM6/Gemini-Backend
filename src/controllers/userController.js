import StatusCodes from '../utils/statusCodes.js'
import { redisClient } from '../config/redisClient.js'
import FetchUserUsecase from '../use-cases/user/fetchUserUseCase.js'
import CreateChatroomUseCase from '../use-cases/user/createChatroomUseCase.js'
import FetchChatroomsUsecase from '../use-cases/user/fetchChatroomsUsecase.js'
import GetChatRoomByIdUseCase from '../use-cases/user/getChatRoomByIdUseCase.js'
import { queue } from '../config/queue.js'



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

export const createChatroomController = async (req, res) => {
  const { id } = req.user
  const { title } = req.body
  try {
    if (!id || !title) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'All fields are required' })
    }

    const createChatroomUseCase = new CreateChatroomUseCase()
    const response = await createChatroomUseCase.excecute(title, id)
    const cacheKey = `user:${id}:chatrooms`
    await redisClient.del(cacheKey)
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: response,
      message: 'Chatroom created successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const getChatroomController = async (req, res) => {
  const { id } = req.user
  try {
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User id is required' })
    }
    const fetchChatroomsUsecase = new FetchChatroomsUsecase()
    const response = await fetchChatroomsUsecase.excecute(id)
    if (res.locals.cacheKey) {
      await redisClient.set(
        res.locals.cacheKey,
        JSON.stringify(response),
        'EX',
        res.locals.cacheTTL || 300
      )
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: 'Chatrooms fetched successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const getChatroomByIdController = async (req, res) => {
  const { id } = req.params
  const trimmedID = id.trim()

  try {
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Chatroom id is required' })
    }
    const getChatRoomByIdUseCase = new GetChatRoomByIdUseCase()
    const response = await getChatRoomByIdUseCase.execute(trimmedID)
    return res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: 'Chatroom fetched successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const messageController = async (req, res) => {
  const { message } = req.body
  const { id } = req.params
  console.log(message, id);
  
  try {
    if (!message || !id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'All fields are required' })
    }
    
    await queue.add('geminiJob', { message, id },{ attempts: 1 })
    
    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Job submitted. Checking for status.' })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)     
      .json({ success: false, message: error.message })    
  }
}
