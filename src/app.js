import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import { dbConnection } from './config/database.js'
import userRoutes from './routes/userRoute.js'
import paymentRoutes from './routes/paymentRoutes.js'
import { stripeWebhookController } from './controllers/paymentController.js'
import worker from '../src/worker/geminiWorker.js'


export const app = express()

dbConnection()
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhookController);
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(authRoutes)
app.use(userRoutes)
app.use(paymentRoutes)

// app.use('/user')
// app.use('/chatroom')
