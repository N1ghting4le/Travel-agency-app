"use client";

import styles from "./tourForm.module.css";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import ResetHoc from "../ResetHoc";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import { useTours } from "../globalContext/hooks/useTours";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import textFields from "./textFields";
import departureCities from "@/lists/departureCities";
import countries from "@/lists/countries";
import {
  getHotelsByCountryEndpoint,
  CREATE_TOUR_API_ENDPOINT,
  UPDATE_TOUR_API_ENDPOINT,
} from "@/constants/queryPaths";

const TourForm = ResetHoc(({ tour, reset }) => {
  const { isAdmin } = useAdmin();
  const { changeTour } = useTours();
  const [hotels, setHotels] = useState(tour ? [tour.hotelTitle] : []);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, defaultValues },
    reset: formReset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      tourTitle: tour?.tourTitle || "",
      tourDescr: tour?.tourDescr || "",
      tourNotes: tour?.tourNotes || "",
      departureCity: tour?.departureCity || "",
      destinationCountry: tour?.destinationCountry || "",
      hotelTitle: tour?.hotelTitle || "",
      basePrice: tour?.basePrice || "",
    },
  });

  const { query: getHotels, isLoading, isError, isSuccess } = useQuery();
  const {
    query: tourMutation,
    queryState: tourMutationState,
    resetQueryState,
  } = useQuery();
  const country = watch("destinationCountry");

  useEffect(() => {
    if (country && !tour) {
      getHotels(getHotelsByCountryEndpoint(country))
        .then(setHotels)
        .catch(() => setHotels([]));
    }
  }, [tour, country, getHotels]);

  const createTour = async (body) => {
    await tourMutation(CREATE_TOUR_API_ENDPOINT, {
      method: "POST",
      json: true,
      body: JSON.stringify(body),
    });
    setTimeout(reset, 2000);
  };

  const updateTour = async (body, data) => {
    const res = await tourMutation(UPDATE_TOUR_API_ENDPOINT, {
      method: "PATCH",
      json: true,
      body: JSON.stringify(body),
    });
    changeTour(res);
    formReset(data);
  };

  const onSubmit = async (data) => {
    const { hotelTitle, ...tourInfo } = data;
    const body = {
      id: tour?.id || null,
      hotelId: tour ? null : hotels.find((h) => h.hotelTitle === hotelTitle).id,
      ...tourInfo,
    };

    try {
      if (tour) {
        await updateTour(body, data);
      } else {
        await createTour(body);
      }
    } finally {
      setTimeout(resetQueryState, 2000);
    }
  };

  const handleCountryChange = () => {
    setHotels([]);
    setValue("hotelTitle", "");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {textFields.map(({ name, placeholder, multiline }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              defaultValue={tour ? tour[name] : ""}
              placeholder={placeholder}
              error={errors[name]}
              onChange={onChange}
              multiline={multiline}
            />
          )}
        />
      ))}
      <SelectMenu
        values={departureCities}
        name="departureCity"
        control={control}
        error={errors.departureCity}
        disabled={!!tour}
        disableClearable
      >
        Город вылета
      </SelectMenu>
      <SelectMenu
        values={countries}
        name="destinationCountry"
        control={control}
        error={errors.destinationCountry}
        disabled={!!tour}
        onChange={handleCountryChange}
        disableClearable
      >
        Страна
      </SelectMenu>
      {isLoading && <AdminSpinner />}
      {isError && <p style={{ color: "red" }}>Не удалось загрузить отели</p>}
      {(isSuccess || tour) && (
        <>
          <SelectMenu
            values={hotels.map((hotel) => hotel.hotelTitle)}
            name="hotelTitle"
            control={control}
            error={errors.hotelTitle}
            disabled={!!tour}
          >
            Отель
          </SelectMenu>
          <Controller
            name="basePrice"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                defaultValue={defaultValues.basePrice}
                placeholder="Начальная цена"
                error={errors.basePrice}
                onChange={onChange}
                type="number"
              />
            )}
          />
          <SubmitWrapper
            queryState={tourMutationState}
            spinner={<AdminSpinner />}
            disabled={tour && !isDirty}
            btnText={tour ? "Сохранить изменения" : "Добавить"}
            errorMsg="Произошла ошибка"
            successText={
              tour ? "Изменения успешно сохранены" : "Тур успешно добавлен"
            }
          />
        </>
      )}
    </form>
  );
});

export default TourForm;
