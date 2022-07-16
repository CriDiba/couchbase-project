import { Bucket, Collection, connect } from 'couchbase';
import { Logger } from "tslog";
import { CHANNEL_COLLECTION_NAME, COUCHBASE_PWD, COUCHBASE_URL, COUCHBASE_USER, MAIN_BUCKET_NAME, PROGRAM_COLLECTION_NAME, USER_COLLECTION_NAME } from "./config";
import { importChannels, importPrograms, importUser } from './parser';

const log = new Logger()

async function main() {
    const cluster = await connect(COUCHBASE_URL, {
        username: COUCHBASE_USER,
        password: COUCHBASE_PWD,
    })

    const bucket: Bucket = cluster.bucket(MAIN_BUCKET_NAME)

    const userCollection: Collection = bucket.collection(USER_COLLECTION_NAME)
    const programCollection: Collection = bucket.collection(PROGRAM_COLLECTION_NAME)
    const channelCollection: Collection = bucket.collection(CHANNEL_COLLECTION_NAME)

    log.info('START import')

    await importUser(userCollection)
    log.info(`finish import ${userCollection.name}`);

    await importPrograms(programCollection)
    log.info(`finish import ${programCollection.name}`);

    await importChannels(channelCollection)
    log.info(`finish import ${channelCollection.name}`);

    log.info('FINISH import')
}


main()