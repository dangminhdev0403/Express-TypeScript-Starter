// src/middlewares/errorHandler.ts

import { createResponse } from '@models/response/format.response.js'
import { AppError } from '@utils/errors/AppError.js'
import { NextFunction, Request, Response } from 'express'

/**
 * Middleware xử lý lỗi tập trung trong toàn hệ thống.
 * Phải có đủ 4 tham số (err, req, res, next) thì Express mới nhận dạng đây là middleware lỗi.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // ✅ Lỗi được tạo ra có chủ đích
  if (err instanceof AppError) {
    const errorRes = createResponse({
      statusCode: err.statusCode,
      message: err.message,

      errors: err.errors
    })

    return res.status(err.statusCode).json(errorRes)
  }

  // ❌ Lỗi không đoán trước được (lỗi hệ thống, lỗi thư viện bên ngoài,...)
  console.error('❌ Unexpected error:', err)

  const errorRes = createResponse({
    statusCode: 500,
    message: 'Internal Server Error',
    data: null,
    errors: process.env.NODE_ENV === 'development' ? err : null
  })

  return res.status(500).json(errorRes)
}
