import { Database } from 'bun:sqlite'

export interface Room {
    roomId: string;
    roomName: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInRoom {
    senderId: string;
    roomId: string;
    username: string;
}

export interface ChatMessage {
    messageId: string;
    roomId: string;
    senderId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}


const db = new Database('chatDb.sqlite', { create: true })
export function initDatabase(): void {

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
        roomId TEXT PRIMARY KEY,
        roomName TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        senderId TEXT,
        roomId TEXT NOT NULL,
        username TEXT NOT NULL,
        PRIMARY KEY (senderId, roomId, username),
        FOREIGN KEY (roomId) REFERENCES rooms(roomId)
        )
    `)
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
        messageId TEXT PRIMARY KEY,
        roomId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roomId) REFERENCES rooms(roomId) ON DELETE CASCADE
        )
    `)
    console.log('Database initialized')
}

initDatabase()

const insertRoomStmt = db.prepare(
    "INSERT INTO rooms (roomId, roomName) VALUES (?, ?)"
);
const getRoomByIdStmt = db.prepare(
    "SELECT * FROM rooms WHERE roomId = ?"
);
const getRoomsByUserIdStmt = db.prepare(
    "SELECT r.* FROM rooms r JOIN users u ON r.roomId = u.roomId WHERE u.senderId = ?"
);
const insertUserInRoomStmt = db.prepare(
    "INSERT OR IGNORE INTO users (senderId, roomId, username) VALUES (?, ?, ?)"
);
const insertMessageStmt = db.prepare(
    "INSERT INTO messages (messageId, roomId, senderId, role, content, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
);
const getMessagesByRoomIdStmt = db.prepare(
    "SELECT * FROM messages WHERE roomId = ? ORDER BY timestamp ASC LIMIT ?"
);

export function createRoom(roomName: string): Room {
    const newRoomId = crypto.randomUUID()
    insertRoomStmt.run(newRoomId, roomName);
    const now = new Date().toISOString();
    return { roomId: newRoomId, roomName, createdAt: now, updatedAt: now };
}

export function getRoom(roomId: string): Room | null {
    return getRoomByIdStmt.get(roomId) as Room | null;
}

export function getUserRooms(senderId: string): Room[] {
    return getRoomsByUserIdStmt.all(senderId) as Room[];
}

export function addUserToRoom(senderId: string, roomId: string, username: string): void {
    insertUserInRoomStmt.run(senderId, roomId, username);
}

export async function saveMessage(message: Omit<ChatMessage, 'timestamp'>): Promise<void> {
    const newMessage: ChatMessage = {
        ...message,
        timestamp: new Date().toISOString(),
    };
    insertMessageStmt.run(
        newMessage.messageId,
        newMessage.roomId,
        newMessage.senderId,
        newMessage.role,
        newMessage.content,
        newMessage.timestamp
    );
}

export function getConversationHistoryFromDB(roomId: number, limit: number = 20): ChatMessage[] {
    return getMessagesByRoomIdStmt.all(roomId, limit) as ChatMessage[];
}

export function washAllTables(): void {
    db.run('DELETE FROM messages');
    db.run('DELETE FROM users');
    db.run('DELETE FROM rooms');
    console.log('All tables washed: messages, users, rooms (and room ID sequence reset)');
}

// NOTE: Helper functions for testing
export function getAllUsersInRooms(): void {
    const users = db.query('SELECT * FROM users').all();
    console.log('Users in rooms:', users);
}
export function getAllRooms(): void {
    const rooms = db.query('SELECT * FROM rooms').all();
    console.log('All rooms:', rooms);
}
export function getAllMessages(): void {
    const messages = db.query('SELECT * FROM messages').all();
    console.log('All messages:', messages);
}

const dbInstance = {
    query: db.query.bind(db),
    run: db.run.bind(db),
    prepare: db.prepare.bind(db),
    transaction: db.transaction.bind(db),
    createRoom,
    getRoom,
    getUserRooms,
    addUserToRoom,
    saveMessage,
    getConversationHistoryFromDB,
    washAllTables,
    getAllUsersInRooms,
    getAllRooms,
    getAllMessages,
};

export default dbInstance;
