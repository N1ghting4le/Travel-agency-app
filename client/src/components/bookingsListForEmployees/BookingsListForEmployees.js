"use client";

import styles from "./bookingsListForEmployees.module.css";
import bookingListStyles from "../bookingsList/bookingsList.module.css";
import UserSpinner from "../loadingSpinners/UserSpinner";
import BookingItem from "../bookingItem/BookingItem";
import { APPROVED, REJECTED } from "@/constants/bookingStatuses";
import { PENDING, FULFILLED, ERROR } from "@/constants/queryStates";
import { groupBookings } from "./utils";

const BookingsListForEmployees = ({
  bookings,
  activeId,
  action,
  queryState,
  areNewBookings,
  emptyText,
}) => {
  const groupedBookings = groupBookings(bookings);

  if (!groupedBookings.length) {
    return <h3>{emptyText}</h3>;
  }

  return groupedBookings.map(([date, bookings]) => (
    <div key={date}>
      <h3>{new Date(date).toLocaleDateString("ru-RU")}</h3>
      <ul className={bookingListStyles.bookingsList} style={{ marginTop: 30 }}>
        {bookings.map(({ booking, userInfo }) => {
          const { id, status } = booking;
          const { name, surname, email, phoneNumber } = userInfo;

          return (
            <li key={id} className={bookingListStyles.listItem}>
              <BookingItem booking={booking} showStatus={!areNewBookings} />
              <div className={styles.userInfoWrapper}>
                <p>Пользователь:</p>
                <p>
                  {name} {surname},
                </p>
                <p>{email},</p>
                <p>{phoneNumber}</p>
                {areNewBookings ? (
                  <button
                    disabled={!!activeId}
                    className={styles.btn}
                    style={{ marginLeft: "auto" }}
                    onClick={action(id)}
                  >
                    Взять бронь
                  </button>
                ) : (
                  <div className={styles.btnWrapper}>
                    <button
                      disabled={!!activeId || status === APPROVED}
                      className={styles.btn}
                      onClick={action(id, true)}
                    >
                      Одобрить
                    </button>
                    <button
                      disabled={!!activeId || status === REJECTED}
                      className={styles.btn}
                      onClick={action(id, false)}
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
              {activeId === id && (
                <>
                  {queryState === PENDING && <UserSpinner />}
                  {queryState === FULFILLED && areNewBookings && (
                    <p style={{ color: "green" }}>Вы взяли эту бронь</p>
                  )}
                  {queryState === ERROR && (
                    <p style={{ color: "red" }}>Произошла ошибка</p>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  ));
};

export default BookingsListForEmployees;
