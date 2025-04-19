import { MongoDBClient } from '@configs/MongoDBClient.js'
import { Collection, Document } from 'mongodb'

export function getCollection<T extends Document>(collectionName: string): Collection<T> {
  const client = MongoDBClient.getInstance()
  return client.getClient().db().collection<T>(collectionName)
}
