import './App.css';
import LoginView from './views/login/LoginView';
import SignUp from './components/login/SignUp';
import Login from './components/login/Login';
import { Routes, Route } from 'react-router-dom';

function App() {

    return (
        <Routes>
            <Route path='/' element={<LoginView />} />
            <Route index element={<Login />} />
            <Route path='signUp' element={<SignUp />} />
        </Routes>
    )
}

export default App;
