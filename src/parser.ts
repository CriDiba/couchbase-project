import { Collection } from 'couchbase';
import { parse } from 'csv-parse';
import fs from 'fs';
import { Logger } from 'tslog';
import { CSV_CHANNELS_PATH, CSV_PREFRENCES_PATH, CSV_PROGRAMS_PATH, CSV_USERS_PATH, CSV_VIEWINGS_PATH } from './config';
import { Channel, Program, User, Viewing } from './types';
import { RawChannel, RawProgram, RawTvViewing, RawUser, RawUserPreference } from './types/raw';

const log = new Logger()

const programsChannel: { [programId: string]: string } = {}
const programsViewings: { [programId: string]: string[] } = {}
const userViewings: { [userId: string]: string[] } = {}

export async function importViewings(collection: Collection) {
    await parseDataset(CSV_VIEWINGS_PATH, async (row: RawTvViewing) => {
        programsChannel[row.program_id] = row.epg_channel_id

        if (programsViewings[row.program_id] === undefined) {
            programsViewings[row.program_id] = []
        }
        programsViewings[row.program_id].push(row.id)

        if (userViewings[row.user] === undefined) {
            userViewings[row.user] = []
        }
        userViewings[row.user].push(row.id)

        const viewingDoc: Viewing = {
            id: row.id,
            userId: row.user,
            groupId: row.group_id,
            programId: row.program_id,
            channelId: row.epg_channel_id,
            startTime: row.starttime,
            endTime: row.endtime,
            timeSlot: row.time_slot,
            dayOfWeek: row.day_of_week
        }

        await collection.upsert(viewingDoc.id, viewingDoc)
    })
}

export async function importUser(collection: Collection) {
    const users: { [userId: string]: User } = {}

    await parseDataset(CSV_USERS_PATH, async (row: RawUser) => {
        users[row.user_id] = {
            id: row.user_id,
            familyId: row.family_id,
            isSubscriber: row.is_subscriber === 't',
            gender: parseInt(row.gender),
            yearOfBirth: parseInt(row.year_of_birth),
            age: parseInt(row.age),
            ageClass: parseInt(row.age_class),
            occupation: parseInt(row.occupation),
            culturalBackground: parseInt(row.cultural_background),
            famSocioEconomicClass: parseInt(row.fam_socio_economic_class),
            famCitySize: parseInt(row.fam_city_size),
            preferences: [],
            viewings: []
        }
    })


    await parseDataset(CSV_PREFRENCES_PATH, async (row: RawUserPreference) => {
        users[row.user].preferences.push({
            channelId: row.epg_channel_id,
            seconds: parseInt(row.seconds),
            preference: parseFloat(row.preference)
        })
    })

    for (const userId in users) {
        const userDoc = users[userId]
        userDoc.viewings = userViewings[userId]
        await collection.upsert(userDoc.id, userDoc)
    }
}

export async function importPrograms(collection: Collection) {
    await parseDataset(CSV_PROGRAMS_PATH, async (row: RawProgram) => {
        const programDoc: Program = {
            id: row.pid,
            genre: row.genre,
            subgenre: row.subgenre,
            channelId: programsChannel[row.pid] ?? '',
            viewings: programsViewings[row.pid]
        }

        await collection.upsert(programDoc.id, programDoc)
    })
}

export async function importChannels(collection: Collection) {
    await parseDataset(CSV_CHANNELS_PATH, async (row: RawChannel) => {
        const channelDoc: Channel = {
            id: row.id,
            title: row.title,
            lag: parseInt(row.lag)
        }

        await collection.upsert(channelDoc.id, channelDoc)
    })
}


async function parseDataset(csvPath: string, callback: (row: any) => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) =>
        fs.createReadStream(csvPath)
            .pipe(parse({ columns: true, delimiter: ';' }))
            .on("data", async function (row) {
                await callback(row)
            })
            .on("end", function () {
                log.info(`finished parsing ${csvPath}`);
                resolve()
            })
            .on("error", function (error) {
                log.error(error.message);
                reject(error)
            })
    )
}