import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        return hashedPassword
    }
    catch (error) {
        console.error("Error hashing password:", error)
    }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(password, hash)
        return isMatch
    }
    catch (error) {
        console.error("Error verifying password:", error)
        return false
    }
}
