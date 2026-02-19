"use client";

import { CREATE_RESORT_API_ENDPOINT } from "@/constants/queryPaths";
import styles from "./resortForm.module.css";
import SelectMenu from "../selectMenu/SelectMenu";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import Input from "../input/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import countries from "@/lists/countries";

const ResortForm = () => {
  const [error, setError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: formReset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      country: "",
      resort: "",
    },
  });
  const { query, queryState, resetQueryState } = useQuery();
  const { isAdmin } = useAdmin();

  const onSubmit = async (data) => {
    try {
      await query(CREATE_RESORT_API_ENDPOINT, {
        method: "POST",
        json: true,
        body: JSON.stringify(data),
      });
      setTimeout(() => formReset(data), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setError(null);
        resetQueryState();
      }, 2000);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <SelectMenu
        values={countries}
        name="country"
        control={control}
        error={errors.country}
        disableClearable
      >
        Страна
      </SelectMenu>
      <Controller
        name="resort"
        control={control}
        render={({ field: { onChange } }) => (
          <Input
            placeholder="Курорт"
            error={errors.resort}
            onChange={onChange}
          />
        )}
      />
      <SubmitWrapper
        queryState={queryState}
        spinner={<AdminSpinner />}
        btnText="Добавить"
        errorMsg={error}
        successText="Курорт успешно добавлен"
      />
    </form>
  );
};

export default ResortForm;
