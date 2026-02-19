"use client";

import styles from "./bookingsList.module.css";
import BookingItem from "../bookingItem/BookingItem";
import { useUser } from "../globalContext/hooks/useUser";

const BookingsList = ({ bookings, userId }) => {
  const { user } = useUser();

  if (user?.id !== userId) {
    return null;
  }

  return (
    <ul className={styles.bookingsList}>
      {bookings.map((item) => (
        <li key={item.id} className={styles.listItem}>
          <BookingItem booking={item} showStatus />
        </li>
      ))}
    </ul>
  );
};

export default BookingsList;
