// src/models/schemas/Users.schemas.ts
import { ObjectId } from 'mongodb'

// Định nghĩa interface User
export interface User {
  _id?: ObjectId // _id có thể là ObjectId hoặc không có (_id có thể tự sinh từ MongoDB)
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

// Tạo class User với constructor và mã hóa mật khẩu
export class UserClass implements User {
  public _id?: ObjectId
  public name: string
  public email: string
  public password: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    name: string,
    email: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    _id?: ObjectId
  ) {
    this._id = _id ?? new ObjectId()
    this.name = name
    this.email = email
    this.password = password
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
