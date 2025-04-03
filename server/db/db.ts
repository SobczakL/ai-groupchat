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
    const users = db.query('SELECT username FROM users')
    console.log(users.all())
}

export async function currentRooms(): Promise<RoomUsers[]> {
    try {
        const query = db.query(`
            SELECT DISTINCT roomId
            FROM users
        `)
        const rows = await query.all()
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

        //NOTE:
        //check if user already is assigned a room
        const queryUsers = db.query(`
            SELECT * FROM users
        `)
        const currentUserPreferences = queryUsers.all()
        const checkCurrentUser = currentUserPreferences.filter((user) => user.username == username)
        if (checkCurrentUser.roomId !== localRoomId) {
            db.query(`
                UPDATE users
                SET roomId = 'localRoomId'
                WHERE username = 'checkCurrentUser.username'
            `)
        }
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
