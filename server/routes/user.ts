// import dbInstance from "../db/db";
// import type { RoomUsers, UserInRoom } from "../lib/types";
// import { tableHelper } from "../db/db";
//
// export async function currentRoomUsers(): Promise<RoomUsers[]> {
//     try {
//         const query = dbInstance.query(`
//             SELECT senderId, roomId, username
//             FROM users
//         `)
//         const rows = query.all()
//
//         return rows.map((row: any) => ({
//             senderId: row.senderId as number,
//             roomId: row.roomId as string,
//             username: row.username as string
//         }))
//
//     }
//     catch (error) {
//         console.error('Error fetching room users:', error)
//         throw error;
//     }
//
// }
//
// export async function addNewUser(senderId: string, roomId: string, username: string): Promise<RoomUsers | undefined> {
//     let localRoomId = roomId;
//     console.log("")
//     if (localRoomId === '') {
//         localRoomId = crypto.randomUUID();
//     }
//     try {
//         //NOTE:
//         //check if user exists
//         console.log("querrying if user exists")
//         const queryUsers = dbInstance.getUserRooms(senderId)
//         console.log(queryUsers)
//         // if (!queryUsers[0]) {
//         //     console.log("user doesnt exist, adding")
//         //     const insertUser = dbInstance.addUserToRoom(senderId, roomId, username)
//         //     insertUser.run(senderId, localRoomId, username)
//         // }
//         // else if (currentUserPreferences[0].roomId !== localRoomId) {
//         //     console.log("user exists, updating if need be")
//         //     const updateUser = dbInstance.query(`
//         //         UPDATE users
//         //         SET roomId = ?
//         //         WHERE username = ?
//         //     `)
//         //     updateUser.run(localRoomId, username)
//         //     console.log(`User roomId changed to: ${localRoomId}`)
//         // }
//         // console.log("here are user details after processing", senderId, roomId, username)
//         return { senderId: senderId, roomId: roomId, username: username }
//     }
//     catch (error) {
//         console.log(`Error adding user to room:`, error)
//     }
// }
