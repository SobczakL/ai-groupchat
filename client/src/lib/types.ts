//User Options Types
type Room = {
    roomId: number;
}
export type Rooms = Room[]

export type User = {
    userId: number;
    roomId: number;
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
    timestamp: number;
};

type UpdateUserPayload = {
    user: User;
}

type WebSocketPayload =
    | ChatMessagePayload
    | UpdateUserPayload
    | any;

type PayloadData = {
    id: number;
    room: number;
    username: string;
    message: string;
    timestamp: number;
}

export type MessageData = {
    type: "create" | "chat" | string;
    payload: PayloadData;
}

export type WebSocketMessage = {
    type: "server_chat" | "user_create" | "user_chat" | string;
    payload: WebSocketPayload;
};
