//NOTE:
//Demo User Flow
//

import { useState, useRef } from "react"
import UserCountOptions from "@/components/userOptions/UserCountOptions"
import UserDetailsOptions from "@/components/userOptions/UserDetailsOptions"
import { useUsers } from "@/hooks/useUsers"

export default function Login() {
    const {
        users,
        isLoading,
        error,
        fetchUsers,
        addUser,
        isAddingUser,
        addUserError
    } = useUsers()
    const [currentUsers, setCurrentUsers] = useState<CurrentUsers>({ users: [], loading: false, error: null })
    const selectedRoom = useRef<(number | null)>(null)

    const handleNewUser = async (newUser: User) => {
        try {
            const user = await addUser(newUser)
            selectedRoom.current = newUser.roomId
            setCurrentUsers(prev => ({
                ...prev,
                users: [...prev.users, newUser]
            }))
            console.log(user)
            console.log(newUser)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            fetchUsers()
        }
    }

    return (
        <div>
            <UserDetailsOptions
                handleNewUser={handleNewUser}
            />
        </div>
    )
}
