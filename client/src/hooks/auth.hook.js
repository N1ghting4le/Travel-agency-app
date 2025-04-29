'use client';

import { BASE_URL } from "@/env";
import useQuery from "./query.hook";
import { useAdmin, useUser, useToken } from "@/components/GlobalContext";
import { useCallback } from "react";

const useAuth = () => {
    const { setUser } = useUser();
    const { setToken } = useToken();
    const { setAdmin } = useAdmin();
    const { query } = useQuery();

    const authorize = useCallback(res => {
        const { token, user } = res;

        if (user.admin) {
            setAdmin(true);
            query(`${BASE_URL}/tour/delete`, "DELETE", {'authorization': `Bearer ${token}`});
        }

        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
    }, []);

    return authorize;
}

export default useAuth;