import './App.css';
import useWebSocket from './lib/websocket';
import MessageWindow from './components/messageWindow/MessageWindow';
import UserOptionsContainer from './components/userOptions/UserOptionsContainer';
import type { Rooms } from './lib/types';

function App() {
    const { receivedMessages, ws, sendMessage } = useWebSocket('');

    const rooms: Rooms = [
        { id: 1, name: "Room 1" },
        { id: 2, name: "Room 2" },
        { id: 3, name: "Room 3" },
    ]

    return (
        <div className='h-[100vh]'>
            <UserOptionsContainer
                rooms={rooms}
            />
            <MessageWindow
                receivedMessages={receivedMessages}
                sendMessage={sendMessage}
            />
        </div>
    );
}

export default App;
