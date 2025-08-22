//NOTE:
//Demo User Flow
//

import { useState, useRef } from "react"
import UserCountOptions from "@/components/userOptions/UserCountOptions"
import UserDetailsOptions from "@/components/userOptions/UserDetailsOptions"

export default function Login({ handleUserCount }) {

    const [userCount, setUserCount] = useState<UserCount>(null)
    const selectedRoom = useRef<(number | null)>(null)

    //FIX:
    //change to a dial of rooms
    const roomOptions = [
        { roomId: 1 },
        { roomId: 2 },
        { roomId: 3 }
    ]

    const handleUserCount = async (value: number) => {
        try {
            setUserCount(value)
        }

        catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <UserCountOptions
                handleUserCount={handleUserCount}
            />
            {userCount > 0 ? (
                Array.from({ length: userCount }).map((_, index) => (
                    <UserDetailsOptions
                        key={index}
                        rooms={roomOptions}
                        handleNewUser={handleNewUser}
                    />
                ))
            ) : (
                <p style={{ margin: '10px', color: 'gray' }}>
                    No user details to display. Set user count.
                </p>
            )}
        </div>
    )
}
