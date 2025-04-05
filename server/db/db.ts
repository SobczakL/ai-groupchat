import { Database } from 'bun:sqlite'
import type { RoomUsers, User } from '../lib/types'

const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

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

//NOTE:
// Temp func to clear existing table for testing
export function washTable(): void {
    db.run('DELETE from users')
    console.log('user table washed')
}

//NOTE:
//temp func for testing
function tableHelper(): void {
    const users = db.query('SELECT * FROM users')
    console.log(users.all())
}

export async function currentRooms(): Promise<RoomUsers[]> {
    try {
        const query = db.query(`
            SELECT username, roomId
            FROM users
        `)
        const rows = await query.all()
        // tableHelper()
        return rows.map((row: any) => ({
            roomId: row.roomId as number,
            username: row.username as string
        }))

    }
    catch (error) {
        console.error('Error fetching room users:', error)
        throw error;
    }
}

export function addUser(username: string, roomId: number): void {
    let localRoomId = roomId;
    if (localRoomId === 0) {
        localRoomId = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }
    try {
        //NOTE:
        //check if user exists
        const queryUsers = db.query(`
            SELECT * FROM users
            `)
        const currentUserPreferences = queryUsers.all().filter((user) => user.username === username)
        console.log(currentUserPreferences)
        if (currentUserPreferences.length < 1) {
            const insertUser = db.prepare(`
                INSERT OR IGNORE INTO users (username, roomId) VALUES (?, ?)
            `);
            insertUser.run(username, localRoomId)
        }
        else if (currentUserPreferences[0].roomId !== localRoomId) {
            const updateUser = db.query(`
                UPDATE users
                SET roomId = ?
                WHERE username = ?
            `)
            updateUser.run(localRoomId, username)
            console.log(`User roomId changed to: ${localRoomId}`)
        }
    }
    catch (error) {
        console.log(`Error adding user to room:`, error)
    }
}

// db.close()
