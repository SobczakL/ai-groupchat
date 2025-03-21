import { useState } from "react";

interface RoomUsers {
    roomId: number;
    usernames: string[];
}
export function useGetCurrentRooms() {
    const [rooms, setRooms] = useState<RoomUsers[]>({})

}
