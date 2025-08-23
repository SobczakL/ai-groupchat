//User Options Types
type Room = {
    roomId: number;
}
export type Rooms = Room[]

export type User = {
    senderId: string;
    roomId: string;
    username: string;
    content?: string;
}

export type UserCount = number | null

export type CurrentUsers = {
    users: User[];
    loading: boolean;
    error: string | null;
}

//WebSocket Message Types
type ChatMessagePayload = {
    user: User;
    content: string;
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
    messageId: string;
    roomId: string;
    senderId: string;
    role: string;
    username?: string;
    content: string;
    timestamp: number;
    displayTime?: { time: string; date: string };
}

export interface AddUserResponseData {
    senderId: number;
    username: string;
}

export interface ApiResponse<T> {
    data: T;
}

export type MessageData = {
    type: "create" | "chat" | string;
    payload: PayloadData;
}

export type WebSocketMessage = {
    type: "server_chat" | "user_create" | "user_chat" | string;
    payload: WebSocketPayload;
};
