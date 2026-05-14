"use client";

import styles from "./signUpForm.module.css";
import { SIGN_UP_API_ENDPOINT } from "@/constants/queryPaths";
import { Controller } from "react-hook-form";
import Input from "../input/Input";
import PasswordInput from "../passwordInput/PasswordInput";
import UserSpinner from "../loadingSpinners/UserSpinner";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import useAuth from "@/hooks/auth.hook";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import fields from "./fields";

const SignUpForm = () => {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();
  const [error, setError] = useState(null);
  const router = useRouter();
  const { authorize } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { query, queryState, resetQueryState } = useQuery();

  const onSubmit = async (data) => {
    const { confirmPassword, ...body } = data;

    try {
      const res = await query(SIGN_UP_API_ENDPOINT, {
        method: "POST",
        json: true,
        body: JSON.stringify(body),
        authorize: isAdmin,
      });

      if (!isAdmin) {
        authorize(res);
        router.back();
      }

      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(resetQueryState, 2000);
    }
  };

  const renderFields = (arr, Input) =>
    arr.map(({ name, placeholder }) => (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <Input
            placeholder={placeholder}
            error={errors[name]}
            onChange={onChange}
          />
        )}
      />
    ));

  const fieldsEls = renderFields(fields.slice(0, 4), Input);
  const passwordFields = renderFields(fields.slice(4), PasswordInput);

  return !pathname.includes("admin") || isAdmin ? (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.fieldsWrapper}>{fieldsEls}</div>
      {passwordFields}
      <SubmitWrapper
        queryState={queryState}
        spinner={<UserSpinner />}
        btnText={isAdmin ? "Добавить сотрудника" : "Регистрация"}
        errorMsg={error || "Произошла ошибка"}
        successText={
          isAdmin ? "Сотрудник добавлен" : "Регистрация прошла успешно"
        }
      />
    </form>
  ) : null;
};

export default SignUpForm;
