import { createContext, useContext, useEffect, useState } from "react";
import {apiConfig} from "../config/ApiConfig";

interface User {
    id: string;
    name: string;
    token: string;             // Access token
    refreshToken: string;      // Refresh token
    isAuthenticated: boolean;
}

interface AuthContextType {
    user: User;
    login: (accessToken: string, refreshToken: string, userId: string, name: string) => void;
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

    const login = (accessToken: string, refreshToken: string, userId: string, name: string) => {
        const newUser = {
            id: userId,
            name,
            token: accessToken,
            refreshToken,
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

    // useEffect(() => {
    //     const saved = localStorage.getItem("user");
    //     if (saved) {
    //         setUser(JSON.parse(saved));
    //     }
    // }, []);

    useEffect(() => {
        const tryRefresh = async () => {
            const saved = localStorage.getItem("user");
            if (!saved) return;

            const parsed = JSON.parse(saved);
            const { token, refreshToken } = parsed;

            if (token && refreshToken) {
                const res = await fetch(`${apiConfig.getBaseUrl()}/api/auth/refresh-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        accessToken: token,
                        refreshToken: refreshToken
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    login(data.accessToken, data.refreshToken, data.userId, data.userName);
                } else {
                    logout();
                }
            }
        };

        tryRefresh();
    }, []);


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
