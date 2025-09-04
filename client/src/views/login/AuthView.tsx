//NOTE:
//Demo User Flow

import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function AuthView() {
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
