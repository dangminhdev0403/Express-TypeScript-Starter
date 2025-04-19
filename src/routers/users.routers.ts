import { createUser } from '@controllers/usersController.js'
import { Router } from 'express'

const router = Router()

// Các route cho CRUD User
router.post('/', createUser) // Tạo người dùng mới

export default router
