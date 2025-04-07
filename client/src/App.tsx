import './App.css';
import { useEffect, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import { useGetCurrentUsers } from './hooks/useGetCurrentUsers';
import { User } from './lib/types';

function App() {
    const { receivedMessages, allReceivedMessages, ws, sendMessage } = useWebSocket();
    const { users, isLoading, error } = useGetCurrentUsers()
    const [localUsers, setLocalUsers] = useState<User[]>([])

    useEffect(() => {
        console.log(isLoading)
        console.log(users)
    }, [isLoading, users])

    //FIX:
    //change to a dial of rooms
    const roomOptions = [
        { roomId: 1 },
        { roomId: 2 },
        { roomId: 3 }
    ]


    const handleNewUser = (newUser) => {
        setLocalUsers(prevUsers => [newUser, ...prevUsers])
        const data = {
            "type": "CREATE",
            "payload": newUser
        }
        sendMessage(data)
    }

    return (
        <div className='h-[100vh]'>
            <UserOptionsContainer
                rooms={roomOptions}
                handleNewUser={handleNewUser}
            />
            {/* {!isLoading ? ( */}
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
