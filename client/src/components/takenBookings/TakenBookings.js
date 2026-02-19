"use client";

import styles from "../newBookings/bookingsForEmployees.module.css";
import { changeBookingStatusApiEndpoint } from "@/constants/queryPaths";
import { useState } from "react";
import { useUser } from "../globalContext/hooks/useUser";
import useQuery from "@/hooks/query.hook";
import BookingsListForEmployees from "../bookingsListForEmployees/BookingsListForEmployees";
import { APPROVED, REJECTED } from "@/constants/bookingStatuses";

const TakenBookings = ({ takenBookings, userId }) => {
  const [bookings, setBookings] = useState(takenBookings);
  const [id, setId] = useState(null);
  const { query, queryState, resetQueryState } = useQuery();
  const { user } = useUser();

  const changeStatus = (id, approve) => async () => {
    const status = approve ? APPROVED : REJECTED;

    setId(id);

    try {
      await query(changeBookingStatusApiEndpoint(id, approve), {
        method: "PATCH",
      });
      setBookings((bookings) =>
        bookings.map((b) =>
          b.booking.id === id ? { ...b, booking: { ...b.booking, status } } : b,
        ),
      );
    } finally {
      setId(null);
      resetQueryState();
    }
  };

  if (user?.id !== userId) {
    return null;
  }

  return (
    <div className={styles.container}>
      <BookingsListForEmployees
        bookings={bookings}
        activeId={id}
        action={changeStatus}
        queryState={queryState}
        emptyText="У вас нет активных бронирований"
      />
    </div>
  );
};

export default TakenBookings;
