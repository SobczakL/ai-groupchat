import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
