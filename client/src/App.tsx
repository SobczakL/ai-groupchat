import './App.css';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import { useGetCurrentRooms } from './hooks/useGetCurrentRooms';
import { CurrentUsers } from './lib/types';

function App() {
    const { receivedMessages, allReceivedMessages, ws, sendMessage } = useWebSocket();
    const { users, isLoading, error, fetchUserData } = useGetCurrentRooms()
    const [currentUsers, setCurrentUsers] = useState<CurrentUsers>({ users: [], loading: false, error: null })
    const selectedRoom = useRef(null)

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


    const handleNewUser = (newUser) => {
        selectedRoom.current = newUser.roomId
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
            {
                !isLoading
                    ? currentUsers.users.map((user, index) => {
                        if (user.roomId === selectedRoom.current) {
                            return (
                                <MessageWindow
                                    key={index}
                                    userDetails={user}
                                    receivedMessages={receivedMessages}
                                    allReceivedMessages={allReceivedMessages}
                                    sendMessage={sendMessage}
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
