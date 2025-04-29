'use client';

import styles from "../newBookings/bookingsForEmployees.module.css";
import { BASE_URL } from "@/env";
import { useState } from "react";
import { useUser, useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import BookingsListForEmployees from "../bookingsListForEmployees/BookingsListForEmployees";

const TakenBookings = ({ takenBookings, userId }) => {
    const [bookings, setBookings] = useState(takenBookings);
    const [id, setId] = useState('');
    const { query, queryState, resetQueryState } = useQuery();
    const { user } = useUser();
    const { token } = useToken();

    const changeStatus = (id, approve) => () => {
        const status = approve ? "Одобрено" : "Отклонено";

        setId(id);
        query(
            `${BASE_URL}/booking/changeStatus/${id}/${approve ? "approve" : "reject"}`,
            "PATCH",
            {'authorization': `Bearer ${token}`}
        )
        .then(() =>
            setBookings(bookings =>
                bookings.map(b =>
                    b.booking.id === id ? { ...b, booking: { ...b.booking, status } } : b)))
        .finally(() => {
            setId('');
            resetQueryState();
        });
    }

    return user?.id === userId ? (
        <div className={styles.container}>
            <BookingsListForEmployees
                bookings={bookings}
                activeId={id}
                action={changeStatus}
                queryState={queryState}
                type="changeStatus"
                emptyText="У вас нет активных бронирований"/>
        </div>
    ) : null;
}

export default TakenBookings;