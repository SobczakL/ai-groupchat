import './App.css';
import { useEffect, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import type { NewUser, Rooms } from './lib/types';
import { useGetCurrentRooms } from './hooks/useGetCurrentRooms';

function App() {
    const { receivedMessages, ws, sendMessage } = useWebSocket('');
    const { rooms, isLoading, error } = useGetCurrentRooms()
    const [users, setUsers] = useState<NewUser[]>([])

    useEffect(() => {
        console.log(isLoading)
        console.log(rooms)
    }, [isLoading, rooms])

    const tempRooms: Rooms = [
        { id: 1, name: "Room 1" },
        { id: 2, name: "Room 2" },
        { id: 3, name: "Room 3" },
    ]

    const handleNewUser = (newUser: NewUser) => {
        const data = {
            "type": "CHECK",
            "payload": newUser
        }
        sendMessage(data)
    }


    return (
        <div className='h-[100vh]'>
            <UserOptionsContainer
                rooms={rooms}
                handleNewUser={handleNewUser}
            />
            {/* {users && */}
            {/*     users.map((user) => ( */}
            {/*         <MessageWindow */}
            {/*             // userDetails={users.user} */}
            {/*             receivedMessages={receivedMessages} */}
            {/*             sendMessage={sendMessage} */}
            {/*         /> */}
            {/*     )) */}
            {/* } */}
        </div>
    );
}

export default App;
