import 'dotenv/config'
import express from 'express'

import db from './config/connectDB'

const app = express()
db.connect()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
