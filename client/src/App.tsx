import './App.css';
import { useEffect, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import { useGetCurrentUsers } from './hooks/useGetCurrentUsers';
import { CurrentUsers, User } from './lib/types';

function App() {
    const { receivedMessages, allReceivedMessages, ws, sendMessage } = useWebSocket();
    const { users, isLoading, error, fetchUserData } = useGetCurrentUsers()
    const [currentUsers, setCurrentUsers] = useState<CurrentUsers>({ users: [], loading: false, error: null })

    useEffect(() => {
        setCurrentUsers({
            users: users,
            loading: isLoading,
            error: error
        })
        console.log(users)
    }, [users, isLoading, error])

    //FIX:
    //change to a dial of rooms
    const roomOptions = [
        { roomId: 1 },
        { roomId: 2 },
        { roomId: 3 }
    ]


    const handleNewUser = (newUser) => {
        const data = {
            "type": "CREATE",
            "payload": newUser
        }
        sendMessage(data)
        fetchUserData()
    }

    return (
        <div className='h-[100vh]'>
            <UserOptionsContainer
                rooms={roomOptions}
                handleNewUser={handleNewUser}
            />
            {!isLoading ? (
                currentUsers.users.map((user, index) => (
                    <MessageWindow
                        key={index}
                        userDetails={user}
                        receivedMessages={receivedMessages}
                        allReceivedMessages={allReceivedMessages}
                        sendMessage={sendMessage}
                    />
                ))
            ) : null
            }
        </div>
    );
}

export default App;
