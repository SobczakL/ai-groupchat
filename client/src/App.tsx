import './App.css';
import { useEffect, useRef, useState } from 'react';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserCountOptions from './components/userOptions/UserCountOptions';
import UserDetailsOptions from './components/userOptions/UserDetailsOptions';
import { UserCount, CurrentUsers } from './lib/types';
import { useUsers } from './hooks/useUsers';
import type { User } from './lib/types';

function App() {
    const [userCount, setUserCount] = useState<UserCount>(null)
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

    //FIX:
    //change to a dial of rooms
    const roomOptions = [
        { roomId: 1 },
        { roomId: 2 },
        { roomId: 3 }
    ]

    const handleUserCount = async (value: number) => {
        try {
            setUserCount(value)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setCurrentUsers({
            users: users,
            loading: isLoading,
            error: error
        })
        //FIX:
        console.log(users)
    }, [users, isLoading, error])



    const handleNewUser = async (newUser: User) => {
        try {
            await AddUser(newUser)
            selectedRoom.current = newUser.roomId
            console.log(newUser)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            fetchUserData()
        }
    }

    return (
        <div className='h-[100vh]'>
            <UserCountOptions
                handleUserCount={handleUserCount}
            />
            {userCount > 0 ? (
                Array.from({ length: userCount }).map((_, index) => (
                    <UserDetailsOptions
                        key={index}
                        rooms={roomOptions}
                        handleNewUser={handleNewUser}
                    />
                ))
            ) : (
                <p style={{ margin: '10px', color: 'gray' }}>
                    No user details to display. Set user count.
                </p>
            )}
            {!isLoading
                ? currentUsers.users.map((user, index) => {
                    return (
                        <MessageWindow
                            key={index}
                            userDetails={user}
                        // receivedMessages={receivedMessages}
                        // allReceivedMessages={allReceivedMessages}
                        // sendMessage={sendMessage}
                        />
                    );
                })
                : null
            }
        </div>
    );
}

export default App;
