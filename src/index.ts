import { Logger } from "tslog";
import { Bucket, Collection, connect } from 'couchbase'
import { COUCHBASE_PWD, COUCHBASE_URL, COUCHBASE_USER } from "./config";

const log = new Logger()

async function main() {
    const cluster = await connect(COUCHBASE_URL, {
        username: COUCHBASE_USER,
        password: COUCHBASE_PWD,
    })

    const bucketName = 'users'
    const bucket: Bucket = cluster.bucket(bucketName)
    const collection: Collection = bucket.defaultCollection()

    const user = await collection.get('U123456789')
    log.info('Result: ', user)
}


main()