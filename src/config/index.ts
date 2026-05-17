import dotenv from 'dotenv'
import { AppError } from '../errors/appError'

dotenv.config()
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET)
console.log('Loaded DB_URI:', process.env.DB_URI)
const config = {
  port: process.env.PORT || 5000,
  db_url: process.env.DB_URI as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires: process.env.JWT_EXPIRE || '7d',
  node_env: process.env.NODE_ENV || 'development',
}

if (!config.db_url) {
  throw new AppError('DB_URI is missing in environment variables', 500)
}

if (!config.jwt_secret) {
  throw new AppError('JWT_SECRET is missing in environment variables', 500)
}

export default config