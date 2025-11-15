'use client';

import { useAdmin, useUser, useToken } from "@/components/GlobalContext";
import { useCallback } from "react";

const useAuth = () => {
    const { setUser } = useUser();
    const { setToken } = useToken();
    const { setAdmin } = useAdmin();

    const authorize = useCallback(res => {
        const { token, user } = res;

        if (user.admin) {
            setAdmin(true);
        }

        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
    }, []);

    return authorize;
}

export default useAuth;