import { ObjectId } from 'mongodb'

export interface BaseDocument {
  _id?: ObjectId
  createdAt: Date
  updatedAt: Date
}
