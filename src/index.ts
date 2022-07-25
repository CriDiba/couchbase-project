import { Bucket, Collection, connect } from 'couchbase';
import readline from 'readline';
import { Logger } from "tslog";
import { CHANNEL_COLLECTION_NAME, COUCHBASE_PWD, COUCHBASE_URL, COUCHBASE_USER, MAIN_BUCKET_NAME, PROGRAM_COLLECTION_NAME, USER_COLLECTION_NAME, VIEWINGS_COLLECTION_NAME } from "./config";
import { importChannels, importPrograms, importUser, importViewings } from './parser';
import { Q1, Q2, Q3 } from './query';

const log = new Logger()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>> ',
})

const printMenuMessage = () => {
    console.log('Couchbase project:')
    console.log('1) Import dataset')
    console.log('2) Q1')
    console.log('3) Q2')
    console.log('4) Q3')
    console.log('5) Exit')
}

const printResponse = (response: unknown) => {
    console.log('\n')
    console.table(response)
    console.log('\n')
}

async function main() {
    const cluster = await connect(COUCHBASE_URL, {
        username: COUCHBASE_USER,
        password: COUCHBASE_PWD,
    })

    const bucket: Bucket = cluster.bucket(MAIN_BUCKET_NAME)

    const viewingsCollection: Collection = bucket.collection(VIEWINGS_COLLECTION_NAME)
    const userCollection: Collection = bucket.collection(USER_COLLECTION_NAME)
    const programCollection: Collection = bucket.collection(PROGRAM_COLLECTION_NAME)
    const channelCollection: Collection = bucket.collection(CHANNEL_COLLECTION_NAME)

    printMenuMessage()
    rl.prompt()

    rl.on('line', async (line: string) => {
        const input = line.trim()
        const command = input.split(' ')[0]
        const params = input.substring(input.indexOf(' ') + 1)

        switch (command) {
            case '1':
                log.info('START import')
                console.time('import time')
                await importViewings(viewingsCollection)
                log.info(`finish import ${viewingsCollection.name}`);
                await importUser(userCollection)
                log.info(`finish import ${userCollection.name}`);
                await importPrograms(programCollection)
                log.info(`finish import ${programCollection.name}`);
                await importChannels(channelCollection)
                log.info(`finish import ${channelCollection.name}`);
                console.timeEnd('import time')
                log.info('FINISH import')
                break

            case '2': {
                console.time('Q1 time')
                const [userId, from, to] = params.split('"').map((x) => x.trim()).filter((x) => x != '')
                const response = await Q1(cluster, userId, from, to)
                printResponse(response)
                console.timeEnd('Q1 time')
            } break

            case '3': {
                console.time('Q2 time')
                const [from, to] = params.split('"').map((x) => x.trim()).filter((x) => x != '')
                const response = await Q2(cluster, from, to)
                printResponse(response)
                console.timeEnd('Q2 time')
            } break

            case '4': {
                console.time('Q3 time')
                const [programId] = params.split(' ')
                const response = await Q3(cluster, programId)
                printResponse(response)
                console.timeEnd('Q3 time')
            } break

            case '5':
                rl.close()
                break

            default:
                console.log(`\nSay what? I might have heard '${line.trim()}'\n`)
                break
        }

        printMenuMessage()
        rl.prompt()
    }).on('close', async () => {
        console.log('Have a great day!')
        process.exit(0)
    })
}

main()
