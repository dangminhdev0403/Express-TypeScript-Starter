import logger from '@configs/logger.js'
import dotenv from 'dotenv'
import { Db, MongoClient, ServerApiVersion } from 'mongodb'
dotenv.config()

// 🔧 Helper: loại bỏ các trường kỹ thuật khỏi command log
function cleanMongoCommand(command: Record<string, any>) {
  const { apiVersion, apiStrict, apiDeprecationErrors, lsid, txnNumber, $clusterTime, $db, ...rest } = command

  // Log thông tin giao dịch MongoDB
  logger.info(`Transaction Number: ${txnNumber ?? 'N/A'}`) // Kiểm tra nếu txnNumber tồn tại, nếu không thì ghi 'N/A'
  logger.info(`API Version: ${apiVersion}`) // Log phiên bản API
  logger.info(`API Strict Mode: ${apiStrict}`) // Log chế độ strict của API
  logger.info(`Deprecation Errors Enabled: ${apiDeprecationErrors}`) // Log nếu có lỗi deprecation

  // Kiểm tra và log thông tin Cluster Time nếu có
  if ($clusterTime && $clusterTime.clusterTime) {
    logger.info(`Cluster Time: ${$clusterTime.clusterTime}`)
  } else {
    logger.info(`Cluster Time: N/A`) // Nếu không có Cluster Time thì ghi 'N/A'
  }

  // Kiểm tra và log thông tin Session ID (LSID) nếu có
  if (lsid && lsid.id) {
    logger.info(`Session ID (LSID): ${lsid.id}`)
  } else {
    logger.info(`Session ID (LSID): N/A`) // Nếu không có LSID thì ghi 'N/A'
  }

  // Trả về các trường còn lại của command và thêm thông tin db
  return { ...rest, db: $db }
}

export class MongoDBClient {
  private static instance: MongoDBClient | null = null
  private readonly client: MongoClient
  private readonly db: Db
  private readonly uri: string

  private constructor() {
    this.uri = process.env.MONGO_URI as string

    this.client = new MongoClient(this.uri, {
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

    this.db = this.client.db(process.env.DB_NAME)
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
