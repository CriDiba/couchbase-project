import dotenv from 'dotenv'

dotenv.config()

export const COUCHBASE_URL = process.env.COUCHBASE_URL ?? ''
export const COUCHBASE_USER = process.env.COUCHBASE_USER ?? ''
export const COUCHBASE_PWD = process.env.COUCHBASE_PWD ?? ''

export const CSV_CHANNELS_PATH = process.env.CSV_CHANNELS_PATH ?? ''
export const CSV_PROGRAMS_PATH = process.env.CSV_PROGRAMS_PATH ?? ''
export const CSV_USERS_PATH = process.env.CSV_USERS_PATH ?? ''
export const CSV_PREFRENCES_PATH = process.env.CSV_PREFRENCES_PATH ?? ''
export const CSV_VIEWINGS_PATH = process.env.CSV_VIEWINGS_PATH ?? ''

export const MAIN_BUCKET_NAME = 'auditel-bucket'
export const USER_COLLECTION_NAME = 'user-record-collection'
export const PROGRAM_COLLECTION_NAME = 'program-record-collection'
export const CHANNEL_COLLECTION_NAME = 'channel-record-collection'
export const VIEWINGS_COLLECTION_NAME = 'viewings-record-collection'