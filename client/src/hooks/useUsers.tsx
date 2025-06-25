import { User } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [addUserError, setAddUserError] = useState<string | null>(null);
    const endpoint = "http://localhost:3000/user";

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(endpoint, {
                method: "GET"
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: User[] = await response.json();
            setUsers(data);
        }
        catch (e: any) {
            console.error("Error fetching rooms:", e);
            setError(e.message || "An unexpected error occurred");
        }
        finally {
            setIsLoading(false);
        }

    }, [])

    const addUser = useCallback(async (newUser: User) => {
        setIsAddingUser(true)
        setAddUserError(false)

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newUser)
            })

            if (!response.ok) {
                throw new Error(`HTTP POST error! Status: ${response.status}`)
            }

            await fetchUsers()
            return true;
        }
        catch (error: any) {
            console.error("Error adding user", error)
        }

    }, [fetchUsers])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return {
        users,
        isLoading,
        error,
        fetchUsers,
        addUser,
        isAddingUser,
        addUserError,
    }
}
