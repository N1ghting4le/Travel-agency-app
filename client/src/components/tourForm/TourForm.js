'use client';

import styles from "./tourForm.module.css";
import { helperStyle } from "../input/Input";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import ResetHoc from "../ResetHoc";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import { FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAdmin, useToken, useTours } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import textFields from "./textFields";
import departureCities from "@/lists/departureCities";
import countries from "@/lists/countries";
import { BASE_URL } from "@/env";

const TourForm = ResetHoc(({ tour, reset }) => {
    const { isAdmin } = useAdmin();
    const { token } = useToken();
    const { changeTour } = useTours();
    const [hotels, setHotels] = useState(tour ? [tour.hotelTitle] : []);

    const { control, handleSubmit, formState: { errors, isDirty, defaultValues }, reset: formReset, watch, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            tourTitle: tour?.tourTitle || "",
            tourDescr: tour?.tourDescr || "",
            tourNotes: tour?.tourNotes || "",
            departureCity: tour?.departureCity || "",
            destinationCountry: tour?.destinationCountry || "",
            hotelTitle: tour?.hotelTitle || "",
            basePrice: tour?.basePrice || ""
        }
    });

    const { query: q1, queryState: qs1 } = useQuery();
    const { query: q2, queryState: qs2, resetQueryState } = useQuery();
    const country = watch("destinationCountry");

    useEffect(() => {
        if (tour) return;

        setHotels([]);
        setValue("hotelTitle", "");

        if (country) {
            q1(`${BASE_URL}/hotel/getHotels/${country}`)
                .then(res => setHotels(res))
                .catch(() => setHotels([]));
        }
    }, [country]);

    const onSubmit = (data) => {
        const { hotelTitle, ...rest } = data;

        const body = {
            id: tour?.id || null,
            hotelId: tour ? null : hotels.find(h => h.hotelTitle === hotelTitle).id,
            ...rest
        }

        q2(
            `${BASE_URL}/tour/${tour ? "update" : "create"}`,
            tour ? "PATCH" : "POST",
            {'Content-type': 'application/json', 'authorization': `Bearer ${token}`},
            JSON.stringify(body)
        )
        .then(res => {
            if (tour) {
                changeTour(res);
                formReset(data);
            } else {
                setTimeout(reset, 2000);
            }
        })
        .finally(() => setTimeout(resetQueryState, 2000));
    }

    const renderTextFields = () => textFields.map(field => {
        const { name, placeholder, multiline } = field;

        return (
            <Controller
                key={name}
                name={name}
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input
                            defaultValue={tour ? tour[name] : ""}
                            placeholder={placeholder}
                            error={errors[name]}
                            onChange={onChange}
                            multiline={multiline}/>
                }
            />
        );
    });

    const textFieldsEls = renderTextFields();

    return isAdmin ? (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {textFieldsEls}
            <SelectMenu
                values={departureCities}
                name="departureCity"
                control={control}
                error={errors.departureCity}
                disabled={!!tour}
                disableClearable>Город вылета</SelectMenu>
            <SelectMenu
                values={countries}
                name="destinationCountry"
                control={control}
                error={errors.destinationCountry}
                disabled={!!tour}
                disableClearable>Страна</SelectMenu>
            {(() => {
                switch (qs1) {
                    case "pending": return <AdminSpinner/>;
                    case "error":
                        return <FormHelperText
                                    sx={helperStyle}
                                    error>Не удалось загрузить отели</FormHelperText>;
                }
            })()}
            {qs1 === "fulfilled" || tour ?
            <>
            <SelectMenu
                values={hotels.map(hotel => hotel.hotelTitle)}
                name="hotelTitle"
                control={control}
                error={errors.hotelTitle}
                disabled={!!tour}>Отель</SelectMenu>
            <Controller
                name="basePrice"
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input
                            defaultValue={defaultValues.basePrice}
                            placeholder="Начальная цена"
                            error={errors.basePrice}
                            onChange={onChange}
                            type="number"/>
                }
            />
            <SubmitWrapper
                queryState={qs2}
                spinner={<AdminSpinner/>}
                disabled={tour && !isDirty}
                btnText={tour ? "Сохранить изменения" : "Добавить"}
                errorMsg="Произошла ошибка"
                successText={tour ? "Изменения успешно сохранены" : "Тур успешно добавлен"}/>
            </> : null}
        </form>
    ) : null;
});

export default TourForm;