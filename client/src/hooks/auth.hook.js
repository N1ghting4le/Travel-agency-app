"use client";

import { useUser } from "@/components/globalContext/hooks/useUser";
import { useGoogleAuthToken } from "@/components/globalContext/hooks/useGoogleAuthToken";
import useQuery from "./query.hook";
import { GOOGLE_AUTH_ENDPOINT } from "@/constants/queryPaths";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { TOKEN_STORAGE_KEY } from "./constants";

const useAuth = () => {
  const { setUser } = useUser();
  const { setGoogleAuthToken } = useGoogleAuthToken();
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

      if (!res.user.id) {
        setGoogleAuthToken(res.token);
        router.push("/complete-profile");
      } else {
        authorize(res);
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
