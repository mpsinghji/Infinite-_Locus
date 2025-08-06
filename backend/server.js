import express from 'express'
import dotenv from 'dotenv'
const app = express()
dotenv.config({ path: './config/config.env' })

app.get('/', (req, res) => {
  res.send('Hello World!')
})
    
app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`)
})
