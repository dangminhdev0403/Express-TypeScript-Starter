// src/config/env.ts
import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
  MONGO_URI: process.env.MONGO_URI!,
  DB_NAME: process.env.DB_NAME!,
  DB_COLLECTION_USERS: process.env.DB_COLLECTION_USERS!,
  NODE_ENV: process.env.NODE_ENV!,
  PORT_NAME: process.env.PORT_NAME!
}
