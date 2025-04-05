//User Options Types
type Room = {
    roomId: number;
}
export type Rooms = Room[]

export type User = {
    userId: number;
    room: Room;
    username: string;
    message?: string;
}

export type Users = User[]

//WebSocket Message Types
type ChatMessagePayload = {
    user: User;
    message: string;
    timestamp: Date;
};

type UpdateUserPayload = {
    user: User;
}

type WebSocketPayload =
    | ChatMessagePayload
    | UpdateUserPayload
    | any;

export type WebSocketMessage = {
    type: "SERVER" | "CHECK" | "CHAT" | string;
    payload: WebSocketPayload;
};
