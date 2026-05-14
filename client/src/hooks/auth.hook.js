"use client";

import { useUser } from "@/components/globalContext/hooks/useUser";
import useQuery from "./query.hook";
import { GOOGLE_AUTH_ENDPOINT } from "@/constants/queryPaths";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { TOKEN_STORAGE_KEY } from "./constants";

const useAuth = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const { query, queryState: authQueryState } = useQuery();

  const authorize = useCallback(
    (res) => {
      const { token, user } = res;

      setUser(user);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    },
    [setUser],
  );

  const googleLogin = useCallback(
    async (credential) => {
      const res = await query(GOOGLE_AUTH_ENDPOINT, {
        method: "POST",
        authorize: false,
        json: true,
        body: JSON.stringify({ credential }),
      });

      authorize(res);

      if (res.newUser) {
        router.push("/complete-profile");
      } else {
        router.push("/");
      }
    },
    [query, authorize, router],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, [setUser]);

  return { authorize, logout, googleLogin, authQueryState };
};

export default useAuth;
