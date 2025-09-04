import jwt from 'jsonwebtoken'
import { z } from 'zod'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET

export const JWTShema = z.object({
    userId: z.string(),
    role: z.string(),
    iat: z.number().optional(),
    exp: z.number().optional()
})
