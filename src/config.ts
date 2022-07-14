import dotenv from 'dotenv'

dotenv.config()

export const COUCHBASE_URL = process.env.COUCHBASE_URL ?? ''
export const COUCHBASE_USER = process.env.COUCHBASE_USER ?? ''
export const COUCHBASE_PWD = process.env.COUCHBASE_PWD ?? ''