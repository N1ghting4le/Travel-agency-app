'use client';

import styles from "./header.module.css";
import { BASE_URL } from "@/env";
import Link from "next/link";
import Logo from "../logo/Logo";
import AccountMenu from "../accountMenu/AccountMenu";
import HeaderMenu from "./menu/Menu";
import { useEffect } from "react";
import { useUser } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import useAuth from "@/hooks/auth.hook";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
    const { user } = useUser();
    const { query } = useQuery();
    const authorize = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || user) return;

        query(`${BASE_URL}/user/auth`, "GET", {'authorization': `Bearer ${token}`})
            .then(authorize)
            .catch(() => localStorage.removeItem("token"));
    }, []);

    useEffect(() => {
        if (
            ((!user || user.role !== "EMPL") && pathname.includes("bookings/")) ||
            ((!user || user.admin) && pathname.includes("users/")) ||
            ((!user || !user.admin) && pathname.includes("admin/"))
        ) {
            router.push('/');
        }
    }, [user]);

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.link}><Logo/></Link>
            {user ? <AccountMenu user={user} isAdmin={user.admin}/> :
            <>
            <div className={styles.btnWrapper}>
                <Link href="/sign-in">
                    <button
                        className={styles.accountBtn}
                        style={{
                            backgroundColor: "transparent",
                            color: "#000"
                        }}>Войти</button>
                </Link>
                <Link href="/sign-up">
                    <button
                        className={styles.accountBtn}
                        style={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}>Зарегистрироваться</button>
                </Link>
            </div>
            <HeaderMenu/>
            </>}
        </header>
    );
}

export default Header;