"use client";

import styles from "./bookingsForEmployees.module.css";
import {
  GET_BOOKINGS_BY_PARAMS_API_ENDPOINT,
  takeBookingApiEndpoint,
  changeBookingStatusApiEndpoint,
} from "@/constants/queryPaths";
import { useState, useEffect, useRef } from "react";
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
import Input from "../input/Input";
import { usePagination } from "@/hooks/pagination.hook";
import { Pagination } from "../pagination";
import { clearTimeoutAndRef } from "@/utils/clearTimeoutAndRef";
import "dayjs/locale/ru";

const EmployeeBookingsView = ({ areNewBookings }) => {
  const [bookings, setBookings] = useState([]);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const updateBookingsTimeoutRef = useRef(null);
  const resetStateTimeoutRef = useRef(null);
  const {
    page,
    setPage,
    pagination,
    initialQuery,
    paginatedQuery,
    queryState: { isLoading, isError, isSuccess },
    isInitialQueryExecuted,
  } = usePagination();
  const { query, queryState, resetQueryState } = useQuery();
  const { user } = useUser();

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      startDate: maxDate,
      endDate: maxDate,
      email: "",
      phoneNumber: "",
    },
  });

  const { startDate, endDate } = watch();

  const sendParams = async (data) => {
    if (!areNewBookings) {
      data.employeeId = user.id;
    }

    const res = await initialQuery(GET_BOOKINGS_BY_PARAMS_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
      json: true,
    });
    setBookings(res);
  };

  const updateBookings = async () => {
    const updatedBookings = await paginatedQuery();
    setBookings(updatedBookings);
  };

  const resetActiveBookingAndQueryState = () => {
    setActiveBookingId(null);
    resetQueryState();
  };

  useEffect(() => {
    sendParams(getValues());
  }, []);

  useEffect(() => {
    resetActiveBookingAndQueryState();
    clearTimeoutAndRef(updateBookingsTimeoutRef);
    clearTimeoutAndRef(resetStateTimeoutRef);

    if (isInitialQueryExecuted) {
      updateBookings();
    }
  }, [page]);

  const takeBooking = (id) => async () => {
    setActiveBookingId(id);

    try {
      await query(takeBookingApiEndpoint(id), { method: "PATCH" });
      updateBookingsTimeoutRef.current = setTimeout(updateBookings, 2000);
    } finally {
      resetStateTimeoutRef.current = setTimeout(
        resetActiveBookingAndQueryState,
        2000,
      );
    }
  };

  const changeStatus = (id, approve) => async () => {
    setActiveBookingId(id);

    try {
      await query(changeBookingStatusApiEndpoint(id, approve), {
        method: "PATCH",
      });
      updateBookings();
    } finally {
      resetActiveBookingAndQueryState();
    }
  };

  const changeStartDate = (startDate) => {
    setValue("startDate", startDate, { shouldValidate: true });
    trigger("endDate");
  };

  const changeEndDate = (endDate) => {
    setValue("endDate", endDate, { shouldValidate: true });
  };

  const handleChange = (field) => (e) => {
    setValue(field, e.target.value, { shouldValidate: true });
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
        <form className={styles.form} onSubmit={handleSubmit(sendParams)}>
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
          <Input
            name="email"
            placeholder="Адрес эл. почты"
            onChange={handleChange("email")}
          />
          <Input
            name="phoneNumber"
            placeholder="Номер телефона"
            onChange={handleChange("phoneNumber")}
          />
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
          activeId={activeBookingId}
          action={areNewBookings ? takeBooking : changeStatus}
          queryState={queryState}
          areNewBookings={areNewBookings}
          emptyText="Нет бронирований по заданным параметрам"
        />
      )}
      <Pagination {...{ page, setPage, pagination }} />
    </div>
  );
};

export default EmployeeBookingsView;
