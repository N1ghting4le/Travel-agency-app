"use client";

import styles from "./header.module.css";
import { AUTH_API_ENDPOINT } from "@/constants/queryPaths";
import Link from "next/link";
import Logo from "../logo/Logo";
import AccountMenu from "../accountMenu/AccountMenu";
import HeaderMenu from "./menu/Menu";
import { useEffect, useState } from "react";
import { useUser } from "../globalContext/hooks/useUser";
import useQuery from "@/hooks/query.hook";
import useAuth from "@/hooks/auth.hook";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const { user } = useUser();
  const { query } = useQuery();
  const { authorize, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      return;
    }

    query(AUTH_API_ENDPOINT)
      .then(authorize)
      .catch(logout)
      .finally(() => setIsAuthorizing(false));
  }, [user, query, authorize, logout]);

  useEffect(() => {
    if (isAuthorizing) {
      return;
    }

    const isRouteRestricted =
      (user?.role !== "EMPL" && pathname.includes("bookings/")) ||
      (user?.admin && pathname.includes("users/")) ||
      (!user?.admin && pathname.includes("admin/"));

    if (isRouteRestricted) {
      router.replace("/");
    }
  }, [isAuthorizing, user, pathname, router]);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.link}>
        <Logo />
      </Link>
      {user ? (
        <AccountMenu user={user} isAdmin={user.admin} />
      ) : (
        <>
          <div className={styles.btnWrapper}>
            <Link href="/sign-in">
              <button
                className={styles.accountBtn}
                style={{
                  backgroundColor: "transparent",
                  color: "#000",
                }}
              >
                Войти
              </button>
            </Link>
            <Link href="/sign-up">
              <button
                className={styles.accountBtn}
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                }}
              >
                Зарегистрироваться
              </button>
            </Link>
          </div>
          <HeaderMenu />
        </>
      )}
    </header>
  );
};

export default Header;
