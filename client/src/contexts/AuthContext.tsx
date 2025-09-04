import React, { createContext, useContext, useState, ReactNode } from "react"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

export const UserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})

export type User = z.infer<typeof formSchema>;

inferface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    token: string | null;
    login: (credentials: Pick<User, 'email' | 'password'> => Promise<boolean>;
    signup: (newUser: Pick<User, 'username' | 'email' | 'password'> => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

inferface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const isLoggedIn = !!token
