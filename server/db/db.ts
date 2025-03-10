import { Database } from 'bun:sqlite'

const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTERGER PRIMARY KEY AUTOINCREMENT,
        roomId INTERGER,
        username TEXT
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
        id INTERGER PRIMARY KEY AUTOINCREMENT,
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


export function checkUsers(username: string): boolean {
    const query = db.prepare('SELECT COUNT(*) AS count FROM users WHERE username = ?')
    const result = query.get(username) as { count: number }
    return result.count > 0;
}

export function addUser(username: string, roomId: number): void {
    let newRoomId;
    if (roomId === 0) {
        const getRandomInt()
    }
    const insertUser = db.prepare(
        'INSERT INTO users (roomId, username) VALUES (?, ?)'
    )
    insertUser.run(roomId, username)
    console.log(`User ${username} added to room ${roomId}`)
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

export function manageRooms(dbPath: string): Database {
    const checkUser = (username) => {

    }
}

export function addUser(dbPath: string, username: string, roomId: number): Database {

}

export function checkRooms(dbPath: string, username: string): Database {
}



const query = db.query(`
    SELECT users.username, users.roomId
    FROM users
`)

const results = query.all()
console.log(results)

db.close()
