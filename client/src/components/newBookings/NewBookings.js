"use client";

import styles from "./bookingsForEmployees.module.css";
import {
  GET_BOOKINGS_BY_DATE_RANGE_API_ENDPOINT,
  takeBookingApiEndpoint,
} from "@/constants/queryPaths";
import { useState, useEffect } from "react";
import { useUser } from "../globalContext/hooks/useUser";
import useQuery from "@/hooks/query.hook";
import TourLoading from "../loadingSpinners/TourLoading";
import BookingsListForEmployees from "../bookingsListForEmployees/BookingsListForEmployees";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ruRU } from "@mui/x-date-pickers/locales";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import schema from "./schema";
import { minDate, maxDate } from "./constants";
import FormDatePicker from "../formDatePicker/FormDatePicker";
import SubmitBtn from "../submitBtn/SubmitBtn";
import "dayjs/locale/ru";

const NewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [takeId, setTakeId] = useState(null);
  const { query, isLoading, isError, isSuccess } = useQuery();
  const { query: take, queryState: takeState, resetQueryState } = useQuery();
  const { user } = useUser();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      startDate: maxDate,
      endDate: maxDate,
    },
  });

  const { startDate, endDate } = watch();

  const sendDateRange = async (data) => {
    setBookings([]);

    const res = await query(GET_BOOKINGS_BY_DATE_RANGE_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
      json: true,
    });
    setBookings(res);
  };

  useEffect(() => {
    sendDateRange({ startDate, endDate });
  }, []);

  const takeBooking = (id) => async () => {
    setTakeId(id);

    try {
      await take(takeBookingApiEndpoint(id), { method: "PATCH" });
      setTimeout(() => {
        setBookings((bookings) => bookings.filter((b) => b.booking.id !== id));
      }, 2000);
    } finally {
      setTimeout(() => {
        setTakeId(null);
        resetQueryState();
      }, 2000);
    }
  };

  const changeStartDate = (startDate) => {
    setValue("startDate", startDate, { shouldValidate: true });
    trigger("endDate");
  };

  const changeEndDate = (endDate) => {
    setValue("endDate", endDate, { shouldValidate: true });
  };

  if (user?.role !== "EMPL") {
    return null;
  }

  return (
    <div className={styles.container}>
      <LocalizationProvider
        adapterLocale="ru"
        dateAdapter={AdapterDayjs}
        localeText={
          ruRU.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <form
          className={styles.datePickers}
          onSubmit={handleSubmit(sendDateRange)}
        >
          <div className={styles.calendarWrapper}>
            <p>От:</p>
            <FormDatePicker
              name="startDate"
              value={startDate}
              minDate={minDate}
              maxDate={endDate}
              error={errors.startDate}
              onChange={changeStartDate}
            />
          </div>
          <div className={styles.calendarWrapper}>
            <p>До:</p>
            <FormDatePicker
              name="endDate"
              value={endDate}
              minDate={startDate}
              maxDate={maxDate}
              error={errors.endDate}
              onChange={changeEndDate}
            />
          </div>
          <SubmitBtn
            style={{ alignSelf: "flex-end", height: 56, paddingInline: 16 }}
          >
            Применить
          </SubmitBtn>
        </form>
      </LocalizationProvider>
      {isLoading && <TourLoading />}
      {isError && <p style={{ color: "red" }}>Произошла ошибка</p>}
      {isSuccess && (
        <BookingsListForEmployees
          bookings={bookings}
          activeId={takeId}
          action={takeBooking}
          queryState={takeState}
          areNewBookings
          emptyText="Нет новых бронирований в выбранные даты"
        />
      )}
    </div>
  );
};

export default NewBookings;
