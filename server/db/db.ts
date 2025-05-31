import { Database } from 'bun:sqlite'

const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        userId INTEGER,
        roomId INTEGER,
        username TEXT,
        PRIMARY KEY (userId, roomId, username),
        FOREIGN KEY (roomId) REFERENCES rooms(roomId)
        )
    `)
    console.log('Database initialized')
}

initDatabase()
const dbInstance = {
    query: db.query.bind(db),
    run: db.run.bind(db),
    prepare: db.prepare.bind(db),
    transaction: db.transaction.bind(db),
}

export default dbInstance;

//NOTE:
// Temp func to clear existing table for testing
export function washTable(): void {
    db.run('DELETE from users')
    console.log('user table washed')
}

//NOTE:
//temp func for testing
export function tableHelper(): void {
    const users = db.query('SELECT * FROM users')
    console.log(users.all())
}

// db.close()
