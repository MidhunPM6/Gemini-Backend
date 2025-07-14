import express from 'express'
import { subscriptionController} from '../controllers/paymentController.js'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'

const router = express.Router()

router.post('/subscribe/pro',verifyJwtToken,subscriptionController)

export default router