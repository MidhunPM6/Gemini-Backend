import express from 'express'
import { subscriptionController,subscriptionStatusController} from '../controllers/paymentController.js'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'

const router = express.Router()

router.post('/subscribe/pro',verifyJwtToken,subscriptionController)
router.get('/subscribe/pro',verifyJwtToken,subscriptionStatusController)


export default router