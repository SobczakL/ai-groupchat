import { useEffect, useState } from "react";


export default function useWebSocket(initialMessage: string) {
    const [message, setMessage] = useState(initialMessage)
    const [receievedMessages, setReceievedMessages] = useState<string[]>([])
    const [ws, setWs] = useState<WebSocket | null>(null)

    useEffect(() => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/`
        const newWs = new WebSocket(wsUrl)

        newWs.onopen = () => {
            console.log(`WebSocket connected`);
        }
        newWs.onclose = () => {
            console.log(`WebSocket closed`);
        }
        newWs.onerror = (error) => {
            console.log(`WebSocket Error: ${error}`)
        }
        newWs.onmessage = (e) => {
            setReceievedMessages((prevMessages) => [...prevMessages, e.data])
        }
        newWs.onopen = () => {
            newWs.send(message)
        }
        setWs(newWs)

        return () => {
            console.log("WebSocket closing")
            newWs.onclose()
        }
    }, [])

    return { message, receievedMessages, ws }
}
