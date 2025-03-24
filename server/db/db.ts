import { Database } from 'bun:sqlite'
import type { RoomUsers } from '../lib/types'

const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

    // db.run(`
    //     CREATE TABLE IF NOT EXISTS users (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     username TEXT UNIQUE,
    //     roomId INTERGER
    //     )
    // `)

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomId INTERGER,
        username TEXT
        )
    `)
    console.log('Database initialized')
}

export async function currentRooms(): Promise<RoomUsers[]> {
    try {
        const query = db.query(`
            SELECT rooms.roomId, rooms.username
            FROM rooms
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

//FIX:
// Temp func to clear existing table for testing
export function washTable(): void {
    db.run('DELETE from users')
    console.log('user table washed')
}

//FIX:

export function addUser(username: string, roomId: number): void {
    let localRoomId = roomId;
    if (localRoomId === 0) {
        localRoomId = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }

    const insertUser = db.prepare(`
        INSERT INTO rooms (roomId, username) VALUES (?, ?)
        ON CONFLICT(username) DO NOTHING
    `);

    const insertInfo = insertUser.run(localRoomId, username);
    if (insertInfo.changes > 0) {
        console.log(`User ${username} added to room ${localRoomId}`);
    }
    else {
        console.log(`User ${username} already exists in room ${roomId}`)
    }
}

// db.close()
