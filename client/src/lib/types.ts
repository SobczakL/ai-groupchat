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

export type CurrentUsers = {
    users: User[];
    loading: boolean;
    error: string | null;
}

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

type PayloadData = {
    username: string;
    room: number;
    message: string;
    timestamp: Date;
}

export type MessageData = {
    type: "create" | "chat" | string;
    payload: PayloadData;
}

export type WebSocketMessage = {
    type: "server_chat" | "user_create" | "user_chat" | string;
    payload: WebSocketPayload;
};
