import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    token: string;             // Access token
    refreshToken: string;      // Refresh token
    role: string;
    isAuthenticated: boolean;
}

interface AuthContextType {
    user: User;
    login: (accessToken: string, refreshToken: string, userId: string, name: string, role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(() => {
        const saved = localStorage.getItem("user");
        return saved
            ? JSON.parse(saved)
            : { id: "", name: "", token: "", refreshToken: "", role: "", isAuthenticated: false };
    });

    const login = (accessToken: string, refreshToken: string, userId: string, name: string, role: string) => {
        const newUser = {
            id: userId,
            name,
            token: accessToken,
            refreshToken,
            role,
            isAuthenticated: true
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        const emptyUser = {
            id: "", name: "", token: "", refreshToken: "", role: "", isAuthenticated: false
        };
        setUser(emptyUser);
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            setUser(JSON.parse(saved));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
