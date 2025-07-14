import express from 'express'
import { fetchUserController ,createChatroomController,getChatroomController,getChatroomByIdController,messageController} from '../controllers/userController.js'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js'



const router = express.Router()

router.get('/user/me',verifyJwtToken,fetchUserController)
router.post('/chatroom',verifyJwtToken,createChatroomController)
router.get('/chatroom',verifyJwtToken ,cacheMiddleware((req) => `user:${req.user.id}:chatrooms`),getChatroomController)
router.get('/chatroom/:id',verifyJwtToken,getChatroomByIdController)
router.post('/chatroom/:id/message',verifyJwtToken ,cacheMiddleware((req) => `prompt:${req.body.message}`),messageController)

export default router