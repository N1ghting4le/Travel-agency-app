'use client';

import styles from "./bookingsList.module.css";
import BookingItem from "../bookingItem/BookingItem";
import { useUser } from "../GlobalContext";

const BookingsList = ({ bookings, userId }) => {
    const { user } = useUser();

    return user?.id === userId ? (
        <ul className={styles.bookingsList}>
            {bookings.map(item => (
                <li key={item.id} className={styles.listItem}>
                    <BookingItem booking={item} showStatus/>
                </li>
            ))}
        </ul>
    ) : null;
}

export default BookingsList;