import { useEffect, useState } from "react";

interface RoomUsers {
    roomId: number;
    usernames: string[];
}

export function useGetCurrentRooms() {
    const [rooms, setRooms] = useState<RoomUsers[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const endpoint = "http://localhost:3000/rooms";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: RoomUsers[] = await response.json();
                setRooms(data);
            } catch (e: any) {
                console.error("Error fetching rooms:", e);
                setError(e.message || "An unexpected error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { rooms, isLoading, error };
}
