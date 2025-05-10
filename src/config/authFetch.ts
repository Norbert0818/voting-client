import { AuthContext } from "../context/AuthContext";
import { apiConfig } from "../config/ApiConfig";
import { useContext } from "react";

export const useAuthFetch = () => {
    const { user, login, logout } = useContext(AuthContext)!;

    const authFetch = async (url: string, options: RequestInit = {}, retry = true): Promise<Response> => {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401 && retry && user.refreshToken) {
            const refreshResponse = await fetch(`${apiConfig.getBaseUrl()}/api/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accessToken: user.token,
                    refreshToken: user.refreshToken
                })
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();

                login(data.accessToken, data.refreshToken, user.id, user.name);

                return await authFetch(url, options, false);
            } else {
                logout();
            }
        }

        return res;
    };

    return authFetch;
};
