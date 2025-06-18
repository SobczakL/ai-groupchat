import './App.css';
import { useEffect, useRef, useState } from 'react';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserCountOptions from './components/userOptions/UserCountOptions';
import UserDetailsOptions from './components/userOptions/UserDetailsOptions';
import { useGetCurrentRooms } from './hooks/useGetCurrentRooms';
import { UserCount, CurrentUsers } from './lib/types';
import { AddUser } from './utils/Adduser';
import type { User } from './lib/types';

function App() {
    const [userCount, setUserCount] = useState<UserCount>(null)
    const { users, isLoading, error, fetchUserData } = useGetCurrentRooms()
    const [currentUsers, setCurrentUsers] = useState<CurrentUsers>({ users: [], loading: false, error: null })
    const selectedRoom = useRef<(number | null)>(null)

    useEffect(() => {
        setCurrentUsers({
            users: users,
            loading: isLoading,
            error: error
        })
        //FIX:
        console.log(users)
    }, [users, isLoading, error])

    //FIX:
    //change to a dial of rooms
    const roomOptions = [
        { roomId: 1 },
        { roomId: 2 },
        { roomId: 3 }
    ]

    const handleUserCount = (value: number) => {
        setUserCount(value)
    }

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
            <UserDetailsOptions
                rooms={roomOptions}
                handleNewUser={handleNewUser}
            />
            {
                !isLoading
                    ? currentUsers.users.map((user, index) => {
                        console.log("user", user)
                        if (user.roomId === selectedRoom.current) {
                            return (
                                <MessageWindow
                                    key={index}
                                    userDetails={user}
                                // receivedMessages={receivedMessages}
                                // allReceivedMessages={allReceivedMessages}
                                // sendMessage={sendMessage}
                                />
                            );
                        }
                        return null;
                    })
                    : null
            }
        </div>
    );
}

export default App;
