"use client";

import {
  getResortsByCountryApiEndpoint,
  CREATE_HOTEL_API_ENDPOINT,
} from "@/constants/queryPaths";
import styles from "./hotelForm.module.css";
import { helperStyle } from "../input/Input";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import Stars from "../stars/Stars";
import Photos from "../photos/Photos";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import ResetHoc from "../ResetHoc";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { textFields, largeTextFields } from "./fields";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";
import countries from "@/lists/countries";

const HotelForm = ResetHoc(({ reset }) => {
  const { isAdmin } = useAdmin();
  const [stars, setStars] = useState(1);
  const [resorts, setResorts] = useState([]);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nutritionTypes: [],
      roomTypes: [],
      country: "",
      resort: "",
    },
    mode: "onChange",
  });

  const { query, queryState, resetQueryState } = useQuery();
  const { query: getResorts, queryState: resortsState } = useQuery();
  const country = watch("country");

  useEffect(() => {
    setResorts([]);
    setValue("resort", "");

    if (country) {
      getResorts(getResortsByCountryApiEndpoint(country)).then((res) =>
        setResorts(res.map((r) => r.resortTitle)),
      );
    }
  }, [country, setValue, getResorts]);

  const onSubmit = async (data) => {
    const { photos, ...hotelData } = data;
    const formData = new FormData();

    Object.entries(hotelData).forEach(([key, value]) =>
      formData.append(key, value),
    );
    photos.forEach((photo) => formData.append("photos", photo));
    formData.append("stars", stars);

    try {
      await query(CREATE_HOTEL_API_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      setTimeout(reset, 2000);
    } finally {
      setTimeout(resetQueryState, 2000);
    }
  };

  const triggerValidation = (name) => () => {
    trigger(name);
  };

  const renderTextFields = (fields, multiline) =>
    fields.map(({ name, placeholder }) => (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <Input
            placeholder={placeholder}
            error={errors[name]}
            onChange={onChange}
            multiline={multiline}
          />
        )}
      />
    ));

  const renderCheckboxFields = (arr, name) =>
    arr.map(({ value, descr }, i) => (
      <FormControlLabel
        key={value}
        control={
          <Checkbox
            value={value}
            sx={{ marginLeft: "10px" }}
            {...register(`${name}.${i}`, {
              onChange: triggerValidation(name),
            })}
          />
        }
        label={descr}
        sx={{ width: "min(100%, max-content)" }}
      />
    ));

  const textFieldsEls = renderTextFields(textFields, false);
  const nutritionFieldsEls = renderCheckboxFields(
    nutritionTypes,
    "nutritionTypes",
  );
  const roomFieldsEls = renderCheckboxFields(roomTypes, "roomTypes");
  const largeTextFieldsEls = renderTextFields(largeTextFields, true);

  if (!isAdmin) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
      encType="multipart/form-data"
    >
      <div className={styles.textFieldsWrapper}>
        {textFieldsEls}
        <SelectMenu
          values={countries}
          name="country"
          control={control}
          error={errors.country}
        >
          Страна
        </SelectMenu>
        <SelectMenu
          values={resorts}
          name="resort"
          control={control}
          error={errors.resort}
          disabled={resortsState !== "fulfilled"}
        >
          Курорт
        </SelectMenu>
      </div>
      <div className={styles.starsWrapper}>
        <h3>Установите звёздность</h3>
        <Stars stars={stars} setStars={setStars} />
      </div>
      <div className={styles.checkboxWrapper}>
        <h3>Выберите типы питания</h3>
        {nutritionFieldsEls}
        {errors.nutritionTypes && (
          <FormHelperText sx={helperStyle} error>
            {errors.nutritionTypes.root.message}
          </FormHelperText>
        )}
      </div>
      <div className={styles.checkboxWrapper}>
        <h3>Выберите типы номеров</h3>
        {roomFieldsEls}
        {errors.roomTypes && (
          <FormHelperText sx={helperStyle} error>
            {errors.roomTypes.root.message}
          </FormHelperText>
        )}
      </div>
      <Photos control={control} trigger={trigger} error={errors.photos} />
      <div className={styles.textFieldsWrapper}>{largeTextFieldsEls}</div>
      <SubmitWrapper
        queryState={queryState}
        spinner={<AdminSpinner />}
        btnText="Добавить"
        errorMsg="Произошла ошибка"
        successText="Отель успешно добавлен"
      />
    </form>
  );
});

export default HotelForm;
