'use client';

import { BASE_URL } from "@/env";
import styles from "./resortForm.module.css";
import SelectMenu from "../selectMenu/SelectMenu";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import Input from "../input/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useToken, useAdmin } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import countries from "@/lists/countries";

const ResortForm = () => {
    const [error, setError] = useState('');
    const { control, handleSubmit, formState: { errors }, reset: formReset } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            country: '',
            resort: ''
        }
    });
    const { query, queryState, resetQueryState } = useQuery();
    const { token } = useToken();
    const { isAdmin } = useAdmin();

    const onSubmit = (data) => {
        setError('');
        query(`${BASE_URL}/resort/create`, "POST", {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }, JSON.stringify(data))
            .then(() => setTimeout(() => formReset(data), 2000))
            .catch(err => setError(err.message))
            .finally(() => setTimeout(() => {
                setError('');
                resetQueryState();
            }, 2000));
    }

    return isAdmin ? (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <SelectMenu
                values={countries}
                name="country"
                control={control}
                error={errors.country}
                disableClearable>Страна</SelectMenu>
            <Controller
                name="resort"
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input
                            placeholder="Курорт"
                            error={errors.resort}
                            onChange={onChange}/>
                }
            />
            <SubmitWrapper
                queryState={queryState}
                spinner={<AdminSpinner/>}
                btnText="Добавить"
                errorMsg={error}
                successText="Курорт успешно добавлен"/>
        </form>
    ) : null;
}

export default ResortForm;