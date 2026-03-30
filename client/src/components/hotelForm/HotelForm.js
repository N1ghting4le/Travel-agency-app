"use client";

import {
  getResortsByCountryApiEndpoint,
  CREATE_HOTEL_API_ENDPOINT,
  getHotelByIdApiEndpoint,
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
import nutritionTypes, { nutritionOrderWeights } from "@/lists/nutritionTypes";
import roomTypes, { roomOrderWeights } from "@/lists/roomTypes";
import countries from "@/lists/countries";
import { getPhotoSrc } from "@/app/(regularUser)/tours/[id]/utils";
import { sortByOrderWeights } from "@/utils/sortByOrderWeights";

const HotelForm = ResetHoc(({ hotel, reset }) => {
  const { isAdmin } = useAdmin();
  const [stars, setStars] = useState(hotel?.stars || 1);
  const [resorts, setResorts] = useState(hotel ? [hotel.resort] : []);
  const [initialPreviews, setInitialPreviews] = useState([]);

  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
    reset: formReset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: hotel?.hotelTitle || "",
      address: hotel?.address || "",
      descr: hotel?.hotelDescr || "",
      notes: hotel?.hotelNotes || "",
      nutritionTypes: hotel?.nutritionTypes || [],
      roomTypes: hotel?.roomTypes || [],
      country: hotel?.resort.resortCountry || "",
      resort: hotel?.resort || null,
      photos: [],
    },
    mode: "onChange",
  });

  const setHotelPhotos = async () => {
    if (hotel) {
      const {
        photos,
        hotelTitle,
        resort: { resortTitle, resortCountry },
      } = hotel;
      const blobs = [];

      for (let i = 0; i < photos.length; i++) {
        try {
          const res = await fetch(
            getPhotoSrc(resortCountry, resortTitle, hotelTitle, photos[i]),
          );
          const blob = await res.blob();
          blobs.push(blob);
        } catch (e) {
          console.error("Ошибка при скачивании:", e);
        }
      }

      setValue("photos", blobs, { shouldDirty: false, shouldTouch: false });
      setInitialPreviews(blobs.map((blob) => URL.createObjectURL(blob)));
    }
  };

  useEffect(() => {
    setHotelPhotos();
  }, []);

  const { query, queryState, resetQueryState } = useQuery();
  const { query: getResorts, queryState: resortsState } = useQuery();
  const country = watch("country");

  useEffect(() => {
    if (!hotel) {
      setResorts([]);
      setValue("resort", null);

      if (country) {
        getResorts(getResortsByCountryApiEndpoint(country)).then(setResorts);
      }
    }
  }, [hotel, country, setValue, getResorts]);

  const createHotel = async (formData) => {
    await query(CREATE_HOTEL_API_ENDPOINT, {
      method: "POST",
      body: formData,
    });
    setTimeout(reset, 2000);
  };

  const updateHotel = async (formData, data) => {
    await query(getHotelByIdApiEndpoint(hotel.id), {
      method: "PATCH",
      body: formData,
    });
    formReset(data);
  };

  const onSubmit = async (data) => {
    const { photos, resort, ...hotelData } = data;
    const formData = new FormData();

    sortByOrderWeights(data.nutritionTypes, nutritionOrderWeights);
    sortByOrderWeights(data.roomTypes, roomOrderWeights);

    Object.entries(hotelData).forEach(([key, value]) =>
      formData.append(key, value),
    );
    photos.forEach((photo) => formData.append("photos", photo));
    formData.append("stars", stars);
    formData.append("resortId", resort.id);

    try {
      if (hotel) {
        await updateHotel(formData, data);
      } else {
        await createHotel(formData);
      }
    } finally {
      setTimeout(resetQueryState, 2000);
    }
  };

  const handleCheckbox = (name) => (e, checked) => {
    const currValues = getValues(name);
    const value = e.target.value;

    if (checked) {
      setValue(name, [...currValues, value]);
    } else {
      setValue(
        name,
        currValues.filter((val) => val !== value),
      );
    }

    trigger(name);
  };

  const renderTextFields = (fields, multiline) =>
    fields.map(({ name, placeholder }) => (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input
            value={value}
            placeholder={placeholder}
            error={errors[name]}
            onChange={onChange}
            multiline={multiline}
          />
        )}
      />
    ));

  const renderCheckboxFields = (arr, name) =>
    arr.map(({ value, descr }) => (
      <FormControlLabel
        key={value}
        control={
          <Checkbox
            value={value}
            checked={getValues(name).includes(value)}
            sx={{ marginLeft: "10px" }}
            onChange={handleCheckbox(name)}
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
          disabled={!!hotel}
        >
          Страна
        </SelectMenu>
        <SelectMenu
          values={resorts}
          valueField="resortTitle"
          name="resort"
          control={control}
          error={errors.resort}
          disabled={!!hotel || resortsState !== "fulfilled"}
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
            {errors.nutritionTypes.message}
          </FormHelperText>
        )}
      </div>
      <div className={styles.checkboxWrapper}>
        <h3>Выберите типы номеров</h3>
        {roomFieldsEls}
        {errors.roomTypes && (
          <FormHelperText sx={helperStyle} error>
            {errors.roomTypes.message}
          </FormHelperText>
        )}
      </div>
      <Photos
        control={control}
        trigger={trigger}
        error={errors.photos}
        externalPreviews={initialPreviews}
      />
      <div className={styles.textFieldsWrapper}>{largeTextFieldsEls}</div>
      <SubmitWrapper
        queryState={queryState}
        spinner={<AdminSpinner />}
        btnText={hotel ? "Сохранить изменения" : "Добавить"}
        errorMsg="Произошла ошибка"
        successText={
          hotel ? "Изменения успешно сохранены" : "Отель успешно добавлен"
        }
      />
    </form>
  );
});

export default HotelForm;
