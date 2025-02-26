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
