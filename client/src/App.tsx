import './App.css';
import { useEffect, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import { useGetCurrentRooms } from './hooks/useGetCurrentRooms';
import { User } from './lib/types';

function App() {
    const { receivedMessages, allReceivedMessages, ws, sendMessage } = useWebSocket();
    const { rooms, isLoading, error } = useGetCurrentRooms()
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        console.log(isLoading)
        console.log(rooms)
    }, [isLoading, rooms])


    const handleNewUser = (newUser) => {
        setUsers(prevUsers => [newUser, ...prevUsers])
        const data = {
            "type": "CREATE",
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
            {/* {rooms.length > 0 ? ( */}
            {/*     rooms.usernames.map((user, index) => ( */}
            {/*         <MessageWindow */}
            {/*             key={user.index} */}
            {/*             userDetails={user} */}
            {/*             receivedMessages={receivedMessages} */}
            {/*             allReceivedMessages={allReceivedMessages} */}
            {/*             sendMessage={sendMessage} */}
            {/*         /> */}
            {/*     )) */}
            {/* ) : null */}
            {/* } */}
        </div>
    );
}

export default App;
