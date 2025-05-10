"use client";

import styles from "./bookForm.module.css";
import dayjs from "dayjs";
import { BASE_URL } from "@/env";
import { Controller } from "react-hook-form";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import UserSpinner from "../loadingSpinners/UserSpinner";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Restaurant, KingBed } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToken } from "../GlobalContext";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";
import { ruRU } from "@mui/x-date-pickers/locales";
import "dayjs/locale/ru";

const today = dayjs();
const minStartDate = today.add(1, "week");
const maxStartDate = today.add(3, "month");
const defaultEndDate = minStartDate.add(1, "week");

const amounts = [
  ["Кол-во взрослых", "adultsAmount"],
  ["Кол-во детей", "childrenAmount"],
];

const BookForm = ({
  id,
  roomTypes: rts,
  nutrTypes,
  basePrice,
  setCanClose,
  handleClose,
}) => {
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const { token } = useToken();
  const [errorMsg, setErrorMsg] = useState("");
  const [booking, setBooking] = useState({
    roomType: 0,
    nutrType: 0,
    adultsAmount: 1,
    childrenAmount: 0,
    startDate: minStartDate,
    endDate: defaultEndDate,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      roomType: "",
      nutrType: "",
      adultsAmount: 1,
      childrenAmount: 0,
    },
  });

  const { query, queryState, resetQueryState } = useQuery();
  const roomType = watch("roomType");
  const nutrType = watch("nutrType");
  const adultsAmount = watch("adultsAmount");

  const setType = (type, arr, val) => {
    setBooking((booking) => ({
      ...booking,
      [type]: val ? arr.indexOf(val.split(" ")[0]) + 1 : 0,
    }));
  };

  useEffect(() => {
    setType("nutrType", nutrTypes, nutrType);
  }, [nutrType]);

  useEffect(() => {
    setType("roomType", rts, roomType);
  }, [roomType]);

  useEffect(() => {
    trigger("adultsAmount");
  }, [adultsAmount, roomType]);

  useEffect(() => {
    if (!isValid) return;

    const {
      roomType,
      nutrType,
      adultsAmount,
      childrenAmount,
      startDate,
      endDate,
    } = booking;
    const dayDiff = endDate.diff(startDate, "day");

    setTotalPrice(
      +(
        basePrice *
        dayDiff *
        (dayDiff === 1 ? 1 : 0.9) *
        roomType *
        (roomType === 1 ? 1 : 0.75) *
        nutrType *
        (nutrType === 1 ? 1 : 0.8) *
        adultsAmount *
        (adultsAmount === 1 ? 1 : 0.85) *
        (childrenAmount + 1) *
        (childrenAmount ? 0.7 : 1)
      ).toFixed(2)
    );
  }, [booking, isValid]);

  const changeStartDate = (startDate) => {
    setBooking((booking) => ({
      ...booking,
      startDate,
      endDate: startDate.add(1, "week"),
    }));
  };

  const changeEndDate = (endDate) => {
    setBooking((booking) => ({ ...booking, endDate }));
  };

  const onSubmit = (data) => {
    setCanClose(false);

    const body = {
      tourId: id,
      startDate: booking.startDate.toDate(),
      endDate: booking.endDate.toDate(),
      totalPrice,
      ...data,
    };

    query(
      `${BASE_URL}/booking/create`,
      "POST",
      { "Content-type": "application/json", authorization: `Bearer ${token}` },
      JSON.stringify(body)
    )
      .then(() => setTimeout(handleClose, 2000))
      .catch((err) => {
        setErrorMsg(err.message);
        setTimeout(resetQueryState, 2000);
      })
      .finally(() => setCanClose(true));
  };

  const renderInputs = () =>
    amounts.map(([text, name]) => (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder={text}
            value={value}
            error={errors[name]}
            onChange={(e) => {
              onChange(e);
              setBooking((booking) => ({
                ...booking,
                [name]: +e.target.value,
              }));
            }}
            type="number"
          />
        )}
      />
    ));

  const inputs = renderInputs();

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.fields}>
        <LocalizationProvider
          adapterLocale="ru"
          dateAdapter={AdapterDayjs}
          localeText={
            ruRU.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <div className={styles.calendarWrapper}>
            <p>Дата начала:</p>
            <DatePicker
              value={booking.startDate}
              minDate={minStartDate}
              maxDate={maxStartDate}
              onChange={changeStartDate}
            />
          </div>
          <div className={styles.calendarWrapper}>
            <p>Дата окончания:</p>
            <DatePicker
              value={booking.endDate}
              minDate={booking.startDate.add(1, "day")}
              maxDate={booking.startDate.add(1, "month")}
              onChange={changeEndDate}
            />
          </div>
          <SelectMenu
            name="roomType"
            control={control}
            values={rts.map(
              (item) =>
                `${item} - ${roomTypes.find((t) => t.value === item).descr}`
            )}
            error={errors.roomType}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <KingBed fontSize="small" />
              <p>Тип номера</p>
            </div>
          </SelectMenu>
          <SelectMenu
            name="nutrType"
            control={control}
            values={nutrTypes.map(
              (item) =>
                `${item} - ${
                  nutritionTypes.find((t) => t.value === item).descr
                }`
            )}
            error={errors.nutrType}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <Restaurant fontSize="small" />
              <p>Тип питания</p>
            </div>
          </SelectMenu>
          {inputs}
        </LocalizationProvider>
      </div>
      {isValid && (
        <p className={styles.priceWrapper}>
          Итоговая стоимость тура:{" "}
          <span className={styles.price}>${totalPrice}</span>
        </p>
      )}
      <SubmitWrapper
        queryState={queryState}
        spinner={<UserSpinner />}
        btnText="Забронировать"
        errorMsg={errorMsg}
        successText="Тур забронирован"
      />
    </form>
  );
};

export default BookForm;
