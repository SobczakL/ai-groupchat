//NOTE:
//Demo User Flow

import { Outlet } from "react-router-dom"
import UserDetailsOptions from "@/components/userOptions/UserDetailsOptions"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleSignUp = () => {

    }

    const handleLogin = () => {

    }

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
            <Outlet />
        </div>
    )
}
