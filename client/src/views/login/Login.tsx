//NOTE:
//Demo User Flow

import SignUpOptions from "@/components/login/signup"
import UserDetailsOptions from "@/components/userOptions/UserDetailsOptions"
import { useUsers } from "@/hooks/useUsers"
import localStorageHandler from "@/lib/utils"
import { useNavigate } from "react-router-dom"

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
    const navigate = useNavigate()

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
            <SignUpOptions

            />
            <UserDetailsOptions
                handleNewUser={handleNewUser}
            />
        </div>
    )
}
