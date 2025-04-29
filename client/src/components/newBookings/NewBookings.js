'use client';

import styles from "./bookingsForEmployees.module.css";
import { BASE_URL } from "@/env";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useUser, useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import TourLoading from "../loadingSpinners/TourLoading";
import BookingsListForEmployees from "../bookingsListForEmployees/BookingsListForEmployees";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from "@mui/x-date-pickers/locales";
import "dayjs/locale/ru";

const today = dayjs();

const NewBookings = () => {
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [bookings, setBookings] = useState([]);
    const [takeId, setTakeId] = useState('');
    const { query, queryState } = useQuery();
    const { query: take, queryState: takeState, resetQueryState } = useQuery();
    const { user } = useUser();
    const { token } = useToken();
    const authHeader = {'authorization': `Bearer ${token}`};

    useEffect(() => {
        setBookings([]);
        query(
            `${BASE_URL}/booking/getByDateRange`,
            "POST",
            {'Content-type': 'application/json', ...authHeader },
            JSON.stringify({
                startDate: startDate.toDate(),
                endDate: endDate.toDate()
            })
        )
        .then(res => setBookings(res));
    }, [startDate, endDate]);

    const takeBooking = (id) => () => {
        setTakeId(id);
        take(
            `${BASE_URL}/booking/take/${id}`,
            "PATCH",
            authHeader
        )
        .then(() => setTimeout(() =>
            setBookings(bookings => bookings.filter(b => b.booking.id !== id)), 2000))
        .finally(() => setTimeout(() => {
            setTakeId('');
            resetQueryState();
        }, 2000));
    }

    return user?.role === "EMPL" ? (
        <div className={styles.container}>
            <LocalizationProvider
                adapterLocale="ru"
                dateAdapter={AdapterDayjs}
                localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
            >
                <div className={styles.datePickers}>
                    <div className={styles.calendarWrapper}>
                        <p>От:</p>
                        <DatePicker
                            value={startDate}
                            maxDate={endDate}
                            onChange={(date) => setStartDate(date)}/>
                    </div>
                    <div className={styles.calendarWrapper}>
                        <p>До:</p>
                        <DatePicker
                            value={endDate}
                            maxDate={today}
                            onChange={(date) => setEndDate(date)}/>
                    </div>
                </div>
            </LocalizationProvider>
            {
                queryState === "pending" ? <TourLoading/> :
                queryState === "error" ? <p style={{color: 'red'}}>Произошла ошибка</p> :
                <BookingsListForEmployees
                    bookings={bookings}
                    activeId={takeId}
                    action={takeBooking}
                    queryState={takeState}
                    type="take"
                    emptyText="Нет новых бронирований в выбранные даты"/>
            }
        </div>
    ) : null;
}

export default NewBookings;