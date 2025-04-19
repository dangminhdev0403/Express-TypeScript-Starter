import { ENV } from '@configs/env.js'
import logger from '@configs/logger.js'
import { Db, MongoClient, ServerApiVersion } from 'mongodb'

// 🔧 Helper: loại bỏ các trường kỹ thuật khỏi command log
function cleanMongoCommand(command: Record<string, any>) {
  const { apiVersion, apiStrict, apiDeprecationErrors, lsid, txnNumber, $clusterTime, $db, ...rest } = command
  return rest
}

export class MongoDBClient {
  private static instance: MongoDBClient | null = null
  private readonly client: MongoClient
  private readonly db: Db

  private constructor() {
    this.client = new MongoClient(ENV.MONGO_URI, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
      monitorCommands: true
    })

    this.client.on('commandStarted', (event) => {
      const commandToLog = cleanMongoCommand(event.command)

      logger.debug(`[MongoDB][Started] ${event.commandName} → ${JSON.stringify(commandToLog, null, 2)}`)
    })

    this.client.on('commandSucceeded', (event) => {
      logger.debug(`[MongoDB][Succeeded] ${event.commandName} (${event.duration}ms)`)
    })

    this.client.on('commandFailed', (event) => {
      logger.error(`[MongoDB][Failed] ${event.commandName}`, event.failure)
    })

    this.db = this.client.db(ENV.DB_NAME)
  }

  static getInstance(): MongoDBClient {
    MongoDBClient.instance ??= new MongoDBClient()
    return MongoDBClient.instance
  }

  async connect(): Promise<void> {
    try {
      await this.client.db('admin').command({ ping: 1 })
      logger.info('✅ Connected to MongoDB')
    } catch (error) {
      logger.error('❌ MongoDB connection failed:', error)
      throw error
    }
  }

  getClient(): MongoClient {
    return this.client
  }

  getDb(): Db {
    return this.db
  }
}
