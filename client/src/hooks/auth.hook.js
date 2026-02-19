"use client";

import { useUser } from "@/components/globalContext/hooks/useUser";
import { useCallback } from "react";

import { TOKEN_STORAGE_KEY } from "./constants";

const useAuth = () => {
  const { setUser } = useUser();

  const authorize = useCallback(
    (res) => {
      const { token, user } = res;

      setUser(user);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    },
    [setUser],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, [setUser]);

  return { authorize, logout };
};

export default useAuth;
