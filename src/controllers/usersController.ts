// src/controllers/usersController.ts
import logger from '@configs/logger.js'
import { getCollection } from '@database/collectionFactory.js'
import { UserClass } from '@models/schema/Users.schema.js'
import { Request, Response } from 'express'

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body

    // Log khi nhận được request tạo user mới
    logger.info(`Received request to create user: ${name}, ${email}`)

    // Tạo đối tượng User mới và tự động mã hóa mật khẩu
    const newUser = new UserClass(name, email, password)

    // Lưu user vào MongoDB

    const usersCollection = getCollection('users')
    const result = await usersCollection.insertOne(newUser)

    // Log khi user được tạo thành công
    logger.info(`User created with _id: ${result.insertedId}`)

    res.status(201).json({ message: 'User created', user: newUser })
  } catch (err) {
    // Log khi có lỗi xảy ra
    logger.error(`Error creating user: ${err}`)
    res.status(500).json({ message: 'Error creating user', error: err })
  }
}
