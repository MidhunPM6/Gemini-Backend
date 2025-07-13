import express from 'express'
import { fetchUserController } from '../controllers/userController.js'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'


const router = express.Router()

router.get('/user/me',verifyJwtToken,fetchUserController)

export default router