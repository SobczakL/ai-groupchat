import { useEffect, useState } from "react";
import type { User } from "@/lib/types";


export function useGetCurrentUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const endpoint = "http://localhost:3000/rooms";

    const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: User[] = await response.json();
            setUsers(data);
        } catch (e: any) {
            console.error("Error fetching rooms:", e);
            setError(e.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return { users, isLoading, error, fetchUserData };
}
