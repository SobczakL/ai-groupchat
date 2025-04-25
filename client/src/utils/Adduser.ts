import { User } from "@/lib/types";

export async function AddUser(newUser: User) {
    const endpoint = "http://localhost:3000/user";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(newUser)
        })

        if (!response.ok) {
            throw new Error(`HTTP POST error! Status: ${response.status}`)
        } else {
            localStorage.setItem("userDetails", JSON.stringify(newUser))
            console.log(response.status)
        }
    }
    catch (error: any) {
        console.error("Error adding user", error)
    }
}
