import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import { dbConnection } from './config/database.js'
import userRoutes from './routes/userRoute.js'
import paymentRoutes from './routes/paymentRoutes.js'
import { stripeWebhookController } from './controllers/paymentController.js'
import worker from '../src/worker/geminiWorker.js'
import cors from 'cors'

export const app = express()


const allowedOrigins = [
  'http://localhost:3000',
];
//  Handle CORS with credentials
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
}));

dbConnection()
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhookController);
app.use(express.json())
app.use(cookieParser())

app.post('/auth', (req, res) => {
  console.log(req.body)
  res.send('Hello World!')
})

app.use(authRoutes)
app.use(userRoutes)
app.use(paymentRoutes)

// app.use('/user')
// app.use('/chatroom')
