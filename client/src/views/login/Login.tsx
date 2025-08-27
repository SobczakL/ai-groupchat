//NOTE:
//Demo User Flow
//

import { useState, useRef } from "react"
import UserCountOptions from "@/components/userOptions/UserCountOptions"
import UserDetailsOptions from "@/components/userOptions/UserDetailsOptions"
import { useUsers } from "@/hooks/useUsers"
import localStorageHandler from "@/lib/utils"

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

    const handleNewUser = async (newUser: User) => {
        try {
            const user = await addUser(newUser)
            console.log(user)
            localStorageHandler('set', { itemName: "userDetails", data: user })
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
