//User Options Types
type Room = {
    id: number;
    name: string;
}
export type Rooms = Room[]

export type User = {
    userID: number;
    room: Room;
    username: string;
    message: string;
}

//WebSocket Message Types
export type WebSocketMessage = {
    type: string;
    payload: User | any;
}
