import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'

import { db } from './configs'
import { userRouter } from './routes'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

db.connect()

app.use('/user', userRouter)

app.listen(port, () => {
  console.log('Server is running on port', port)
})
