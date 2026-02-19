"use client";

import styles from "./bookForm.module.css";
import { CREATE_BOOKING_API_ENDPOINT } from "@/constants/queryPaths";
import { Controller } from "react-hook-form";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import FormDatePicker from "../formDatePicker/FormDatePicker";
import UserSpinner from "../loadingSpinners/UserSpinner";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Restaurant, KingBed } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";
import { ruRU } from "@mui/x-date-pickers/locales";
import {
  minStartDate,
  maxStartDate,
  defaultEndDate,
  amounts,
} from "./constants";
import { calculateTotalPrice } from "./utils";
import "dayjs/locale/ru";

const BookForm = ({
  id,
  roomTypes: rts,
  nutrTypes,
  basePrice,
  setCanClose,
  handleClose,
}) => {
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      startDate: minStartDate,
      endDate: defaultEndDate,
      roomType: null,
      nutrType: null,
      adultsAmount: 1,
      childrenAmount: 0,
    },
  });

  const { query, queryState, resetQueryState } = useQuery();
  const formValues = watch();

  const totalPrice = useMemo(() => {
    if (!isValid) {
      return null;
    }

    return Number(
      calculateTotalPrice(rts, nutrTypes, basePrice, formValues).toFixed(2),
    );
  }, [isValid, rts, nutrTypes, basePrice, formValues]);

  const changeStartDate = (startDate) => {
    setValue("startDate", startDate, { shouldValidate: true });
    trigger("endDate");
  };

  const changeEndDate = (endDate) => {
    setValue("endDate", endDate, { shouldValidate: true });
  };

  const changeRoomType = () => {
    trigger("adultsAmount");
  };

  const onSubmit = async ({ nutrType, roomType, ...data }) => {
    setCanClose(false);

    const body = {
      tourId: id,
      totalPrice,
      nutrType: nutrType.value,
      roomType: roomType.value,
      ...data,
    };

    try {
      await query(CREATE_BOOKING_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(body),
        json: true,
      });
      setTimeout(handleClose, 2000);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(resetQueryState, 2000);
    } finally {
      setCanClose(true);
    }
  };

  const roomTypeOptions = rts.map((item) =>
    roomTypes.find((t) => t.value === item),
  );
  const nutrTypeOptions = nutrTypes.map((item) =>
    nutritionTypes.find((t) => t.value === item),
  );
  const minEndDate = (formValues.startDate ?? minStartDate).add(1, "day");
  const maxEndDate = (formValues.startDate ?? maxStartDate).add(1, "month");

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
            <FormDatePicker
              name="startDate"
              value={formValues.startDate}
              minDate={minStartDate}
              maxDate={maxStartDate}
              error={errors.startDate}
              onChange={changeStartDate}
            />
          </div>
          <div className={styles.calendarWrapper}>
            <p>Дата окончания:</p>
            <FormDatePicker
              name="endDate"
              value={formValues.endDate}
              minDate={minEndDate}
              maxDate={maxEndDate}
              error={errors.endDate}
              onChange={changeEndDate}
            />
          </div>
          <SelectMenu
            name="roomType"
            control={control}
            values={roomTypeOptions}
            valueField="descr"
            error={errors.roomType}
            onChange={changeRoomType}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <KingBed fontSize="small" />
              <p>Тип номера</p>
            </div>
          </SelectMenu>
          <SelectMenu
            name="nutrType"
            control={control}
            values={nutrTypeOptions}
            valueField="descr"
            error={errors.nutrType}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <Restaurant fontSize="small" />
              <p>Тип питания</p>
            </div>
          </SelectMenu>
          {amounts.map(({ text, name }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={text}
                  value={value}
                  error={errors[name]}
                  onChange={onChange}
                  type="number"
                />
              )}
            />
          ))}
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
