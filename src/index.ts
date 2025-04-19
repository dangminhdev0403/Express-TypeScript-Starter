import { ENV } from '@configs/env.js'
import { MongoDBClient } from '@configs/MongoDBClient.js'
import { morganMiddleware } from '@configs/morgan.js'
import homeRouter from '@routers/users.routers.js'
import express from 'express'

const port = Number(ENV.PORT_NAME)
const ip = '127.0.0.1' // localhost
const app = express()

app.use(express.json())

// Sử dụng router cho người dùng
app.use('/', homeRouter)
app.use(morganMiddleware)

async function startServer() {
  try {
    // Nếu cần kết nối MongoDB, bỏ comment và cấu hình tại .env
    const dbClient = MongoDBClient.getInstance()
    await dbClient.connect()

    app.listen(port, ip, () => {
      console.log(`🚀 Server đang chạy tại http://${ip}:${port}`)
    })
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error)
    process.exit(1)
  }
}

startServer()
