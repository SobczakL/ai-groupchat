import { useEffect, useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import { serverComm } from './lib/utils'

function App() {

    const [data, setData] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newData = await serverComm();
                setData(newData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData(`Error: ${error}`)
            }
        };
        fetchData();
    }, []);
    return (
        <div className='h-[100vh]'>
            <p className='mx-16 text-black'>hello!</p>
            <Button>button</Button>
            <p>{data}</p>
        </div>
    )
}

export default App
