import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import { dbConnection } from './config/database.js'
import userRoutes from './routes/userRoute.js'

export const app = express()

dbConnection()
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use( authRoutes)
app.use( userRoutes)

// app.use('/user')
// app.use('/chatroom')
 