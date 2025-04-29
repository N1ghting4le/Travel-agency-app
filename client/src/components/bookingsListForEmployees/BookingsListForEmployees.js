'use client';

import styles from "./bookingsListForEmployees.module.css";
import { labelStyle } from "../input/Input";
import bookingListStyles from "../bookingsList/bookingsList.module.css";
import UserSpinner from "../loadingSpinners/UserSpinner";
import BookingItem from "../bookingItem/BookingItem";
import { Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";
import Input from "../input/Input";
import statuses from "@/lists/statuses";
import { useState } from "react";

const BookingsListForEmployees = ({ bookings, activeId, action, queryState, type, emptyText }) => {
    const [status, setStatus] = useState("Любой");
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleStatusChange = (e) => setStatus(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);

    const renderBookings = (bookings) => bookings.map(({ booking, userInfo }) => {
        const { id, status } = booking;
        const { name, surname, email, phoneNumber } = userInfo;

        return (
            <li key={id} className={bookingListStyles.listItem}>
                <BookingItem booking={booking} showStatus={type !== "take"}/>
                <div className={styles.userInfoWrapper}>
                    <p>Пользователь:</p>
                    <p>{name} {surname},</p>
                    <p>{email},</p>
                    <p>{phoneNumber}</p>
                    {type === "take" ?
                    <button
                        disabled={!!activeId}
                        className={styles.btn}
                        style={{marginLeft: 'auto'}}
                        onClick={action(id)}
                    >
                        Взять бронь
                    </button> :
                    <div className={styles.btnWrapper}>
                        <button
                            disabled={!!activeId || status === "Одобрено"}
                            className={styles.btn}
                            onClick={action(id, true)}
                        >
                            Одобрить
                        </button>
                        <button
                            disabled={!!activeId || status === "Отклонено"}
                            className={styles.btn}
                            onClick={action(id, false)}
                        >
                            Отклонить
                        </button>
                    </div>}
                </div>
                {activeId === id &&
                    queryState === "pending" ? <UserSpinner/> :
                    queryState === "fulfilled" && type === "take" ?
                    <p style={{color: 'green'}}>Вы взяли эту бронь</p> :
                    queryState === "error" ?
                    <p style={{color: 'red'}}>Произошла ошибка</p> : null
                }
            </li>
        );
    });

    const filteredBookings = bookings.filter(({ booking, userInfo }) =>
        (status === 'Любой' || booking.status === status) &&
        (!email || userInfo.email.toLowerCase().includes(email.toLowerCase())) &&
        (!phoneNumber || userInfo.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase()))
    );

    return (
        <>
            <div className={styles.filterContainer}>
                {type === "changeStatus" &&
                <Box sx={{ minWidth: 300 }}>
                    <FormControl fullWidth>
                    <InputLabel sx={labelStyle}>Статус</InputLabel>
                    <Select
                        value={status}
                        label="Статус"
                        onChange={handleStatusChange}
                    >
                        {statuses.map((item => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        )))}
                    </Select>
                    </FormControl>
                </Box>}
                <Input placeholder="Адрес эл. почты" onChange={handleEmailChange}/>
                <Input placeholder="Номер телефона" onChange={handlePhoneNumberChange}/>
            </div>
            {filteredBookings.length ? Object
                .entries(Object.groupBy(filteredBookings, b => b.booking.bookingDate))
                .map(([date, bookings]) => (
                <div key={date}>
                    <h3>{new Date(date).toLocaleDateString("ru-RU")}</h3>
                    <ul className={bookingListStyles.bookingsList} style={{marginTop: 30}}>
                        {renderBookings(bookings)}
                    </ul>
                </div>
            )) : <h3>{bookings.length ? "Нет бронирований" : emptyText}</h3>}
        </>
    );
}

export default BookingsListForEmployees;