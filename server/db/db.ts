import { Database } from 'bun:sqlite'
import type { RoomUsers } from '../lib/types'

const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
        roomId INTEGER PRIMARY KEY
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        username TEXT,
        roomId INTEGER,
        PRIMARY KEY (username, roomId),
        FOREIGN KEY (roomId) REFERENCES rooms(roomId)
        )
    `)
    console.log('Database initialized')
}

//FIX:
// function tableHelper(): void {
//     const users = db.run('SELECT * FROM users')
//     const rooms = db.run('SELECT * FROM rooms')
//     console.table(users)
//     console.table(rooms)
// }

export async function currentRooms(): Promise<RoomUsers[]> {
    try {
        const query = db.query(`
            SELECT rooms.roomId FROM rooms
        `)
        const rows = await query.all()
        console.log(rows)
        // tableHelper()
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
    db.run('DELETE from rooms')
    console.log('user table washed')
}


//FIX:

export function addUser(username: string, roomId: number): void {
    let localRoomId = roomId;
    if (localRoomId === 0) {
        localRoomId = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }
    try {
        const insertRoom = db.prepare(`
            INSERT OR IGNORE INTO rooms (roomId) VALUES (?)
        `);
        insertRoom.run(localRoomId)

        const insertUser = db.prepare(`
            INSERT OR IGNORE INTO users (username, roomId) VALUES (?, ?)
        `);

        const insertInfo = insertUser.run(username, localRoomId);
        if (insertInfo.changes > 0) {
            console.log(`User ${username} added to room ${localRoomId}`);
        }
        else {
            console.log(`User ${username} already exists in room ${roomId}`)
        }

    }
    catch (error) {
        console.log(`Error adding user to room:`, error)
    }

}

// db.close()
