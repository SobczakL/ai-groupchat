import { Database } from 'bun:sqlite'
import type { RoomUsers } from '../lib/types'

const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        roomId INTERGER
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomId INTERGER,
        username TEXT
        )
    `)
    console.log('Database initialized')
}

// --TODO:
// - when user created, check if user exists and roomId
// - if roomId != db roomId -> update roomId
// - subscribe user to roomId


export async function currentRooms(): Promise<RoomUsers[]> {
    try {
        const query = db.query(`
            SELECT
            r.roomId,
            GROUP_CONCAT(u.username) AS usernames
            FROM
            rooms r
            LEFT JOIN
            users u ON r.roomId = u.roomId
            GROUP BY
            r.roomId
        `)
        const rows = await query.all()
        return rows.map((row: any) => ({
            roomId: row.roomId as number,
            usernames: row.usernames ? (row.usernames as string).split(',') : []
        }))
    }
    catch (error) {
        console.error('Error fetching room users:', error)
        throw error;
    }
}

export function tableHelper(): void {
    const query = db.query(`
        SELECT users.username, users.roomId
        FROM users
    `)

    const results = query.all()
    console.log('tableHelper results', results)
}

export function washTable(): void {
    db.run('DELETE from users')
    console.log('user table washed')
}

export function addUser(username: string, roomId: number): void {
    let localRoomId = roomId;
    if (localRoomId === 0) {
        localRoomId = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }

    const insertUser = db.prepare(`
        INSERT INTO users (username, roomId) VALUES (?, ?)
        ON CONFLICT(username) DO NOTHING
    `);

    const insertInfo = insertUser.run(username, localRoomId);
    if (insertInfo.changes > 0) {
        console.log(`User ${username} added to room ${localRoomId}`);
    }
    else {
        console.log(`User ${username} already exists`)
    }
}



export function checkRooms(roomId: number, username: string): void {
    const query = db.prepare('SELECT COUNT(*) AS count FROM rooms WHERE roomId = ?')
    const result = query.get(roomId) as { count: number }

    if (!result) {
        const insertRooms = db.prepare(
            'INSERT INTO rooms (roomId) VALUES (?)'
        )
        insertRooms.run(roomId)
    }
}


// db.close()
