'use client';

import styles from "./userInfo.module.css";
import { useUser } from "../GlobalContext";

const UserInfo = ({ userId }) => {
    const { user } = useUser();

    if (user?.id !== userId) return null;

    const { name, surname, email, phoneNumber } = user;

    return (
        <div className={styles.wrapper}>
            <div className={styles.infoItem}>
                <p className={styles.title}>Имя и фамилия</p>
                <p className={styles.info}>{name} {surname}</p>
            </div>
            <div className={styles.infoItem}>
                <p className={styles.title}>Адрес эл. почты</p>
                <p className={styles.info}>{email}</p>
            </div>
            <div className={styles.infoItem}>
                <p className={styles.title}>Номер телефона</p>
                <p className={styles.info}>{phoneNumber}</p>
            </div>
        </div>
    );
}

export default UserInfo;