import express from 'express'
import dotenv from 'dotenv'
import eventrouter from './routes/eventsRoute.js'
import userRouter from './routes/userRoute.js'
import mongoose from "mongoose"
import connectdb from './config/db.js'
import cors from "cors"

const app = express()
dotenv.config({ path: './config/config.env' })

connectdb();
app.use(express.json());
app.use(cors());

app.use('/user',userRouter)
app.use('/event',eventrouter)

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`)
})

