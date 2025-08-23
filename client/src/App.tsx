import './App.css';
import DemoUserPortal from './views/temp/DemoUserPortal';
import { useUsers } from './hooks/useUsers';

function App() {
    //NOTE:
    //
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

    const handleNewUser = async (newUser: User) => {
        try {
            await addUser(newUser)
            selectedRoom.current = newUser.roomId
            setCurrentUsers(prev => ({
                ...prev,
                users: [...prev.users, newUser]
            }))
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
        <DemoUserPortal />
    )
}

export default App;
