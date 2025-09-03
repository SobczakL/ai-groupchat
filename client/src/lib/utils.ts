import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LocalStorageMethod, LocalStoragePayload } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function serverComm() {
    const response = await
        fetch(
            "http://localhost:3000/",
            {
                method: 'GET',
            }
        )
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
    }
    const data = response.text()
    return data
}

// Format Date
//FIX: get user locale for accurate rep of time over time
export function convertDateString(
    dateString: number,
    // locale,
    // timeZone
): { time: string } {
    const dateObj = new Date(dateString)

    if (isNaN(dateObj.getTime())) {
        console.error("Invalid date string")
        return {
            time: 'invalid',
            // date: 'invalid',
            // fullDate: null
        }
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: "America/New_York"
    }

    const timePart = dateObj.toLocaleTimeString('en-US', timeOptions)

    return {
        time: timePart,
        // date,
        // fullDate
    }
}

//Handle all localStorage
//
export default function localStorageHandler(
    method: LocalStorageMethod,
    payload: LocalStoragePayload
): unknown | null | void {
    const { itemName, data } = payload

    if (!itemName) {
        console.error("localStorageHandler: no itemName set")
    }

    try {
        switch (method) {
            case "set":
            case "update":
                if (data === undefined) {
                    console.warn(`localStorageHandler: no data provided for ${method}`)
                    localStorage.setItem(itemName, JSON.stringify(null))
                    return;
                }
                localStorage.setItem(itemName, JSON.stringify(data))
                break;
            case "get":
                const storedValue = localStorage.getItem(itemName)
                if (storedValue === null) {
                    console.log(`localStorageHandler: item ${itemName} not found`)
                    return null;
                }
                try {
                    const parsedData = JSON.parse(storedValue)
                    return parsedData
                }
                catch (error) {
                    console.error(`localStorageHandler: error parsing data for ${itemName}`, error)
                    return storedValue
                }
            case "remove":
                localStorage.removeItem(itemName)
                console.log(`localStorageHandler: item ${itemName} removed`)
                break;
        }
    }
    catch (error) {
        console.error(`localStorageHandler: error trying ${method} operation`, error)
        if (method === 'get') return null
        return;
    }
}
