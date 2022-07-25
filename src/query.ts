import { Cluster } from "couchbase";
import { Logger } from "tslog";

const log = new Logger()

export async function Q1(cluster: Cluster, userId: string, from: string, to: string) {
    const query = `
      SELECT W.id, W.programId, W.channelId, W.startTime, W.endTime
      FROM \`auditel-bucket\`._default.\`user-record-collection\` AS U USE KEYS $USER_ID
      UNNEST U.viewings V
        JOIN \`auditel-bucket\`._default.\`viewings-record-collection\` AS W ON V = META(W).id
      WHERE W.startTime >= $START_PERIOD
        AND W.endTime <= $END_PERIOD
    `

    const options = { parameters: { USER_ID: userId, START_PERIOD: from, END_PERIOD: to } }

    try {
        const result = await cluster.query(query, options)
        return result.rows
    } catch (error) {
        log.error('Query failed: ', error)
        return []
    }
}

export async function Q2(cluster: Cluster, from: string, to: string) {
    const query = `
      SELECT V.programId, SUM(DATE_DIFF_STR(V.endTime, V.startTime, 'second')) AS duration
      FROM \`auditel-bucket\`._default.\`viewings-record-collection\` AS V
      WHERE V.startTime >= $START_PERIOD
        AND V.endTime <= $END_PERIOD
      GROUP BY V.programId
      ORDER BY duration DESC
      LIMIT 1
    `

    const options = { parameters: { START_PERIOD: from, END_PERIOD: to } }

    const getProgramInfoQuery = `
      SELECT P.id AS programId, P.genre, P.subgenre, C.title AS channel
      FROM \`auditel-bucket\`._default.\`program-record-collection\` AS P USE KEYS $PROGRAM_ID
        JOIN \`auditel-bucket\`._default.\`channel-record-collection\` AS C ON P.channelId = META(C).id
    `

    try {
        const result = await cluster.query(query, options)
        const program = result.rows.pop()

        if (!program) {
            return []
        }

        const programInfo = await cluster.query(getProgramInfoQuery, { parameters: { PROGRAM_ID: program.programId } })

        return [{ ...programInfo.rows[0], duration: program.duration }]
    } catch (error) {
        log.error('Query failed: ', error)
        return []
    }
}

export async function Q3(cluster: Cluster, programId: string) {
    const query = `   
      WITH groups_count AS (
        SELECT W.groupId,
               COUNT(W.userId) AS numUsers
        FROM \`auditel-bucket\`._default.\`program-record-collection\` AS P USE KEYS $PROGRAM_ID
        UNNEST P.viewings V
            JOIN \`auditel-bucket\`._default.\`viewings-record-collection\` AS W ON V = META(W).id
        GROUP BY W.groupId
      )

      SELECT G.groupId, G.numUsers
      FROM groups_count AS G
      WHERE EVERY groupCount IN groups_count SATISFIES groupCount.numUsers <= G.numUsers END
    `

    const options = { parameters: { PROGRAM_ID: programId } }

    try {
        const result = await cluster.query(query, options)
        return result.rows
    } catch (error) {
        log.error('Query failed: ', error)
        return []
    }
}