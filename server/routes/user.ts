import dbInstance from "../db/db";
import type { RoomUsers } from "../lib/types";

export async function currentRoomUsers(): Promise<RoomUsers[]> {
    try {
        const query = dbInstance.query(`
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

export async function addNewUser(username: string, roomId: number): void {
    let localRoomId = roomId;
    if (localRoomId === 0) {
        localRoomId = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }
    try {
        //NOTE:
        //check if user exists
        const queryUsers = dbInstance.query(`
            SELECT * FROM users
            `)
        const currentUserPreferences = queryUsers.all().filter((user) => user.username === username)
        console.log(currentUserPreferences)
        if (currentUserPreferences.length < 1) {
            const insertUser = dbInstance.prepare(`
                INSERT OR IGNORE INTO users (username, roomId) VALUES (?, ?)
            `);
            insertUser.run(username, localRoomId)
        }
        else if (currentUserPreferences[0].roomId !== localRoomId) {
            const updateUser = dbInstance.query(`
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
