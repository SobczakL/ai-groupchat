import './App.css';
import { useEffect, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import type { NewUser } from './lib/types';
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
        { roomId: 1 },
        { roomId: 2 },
        { roomId: 3 },
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
                rooms={tempRooms}
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
