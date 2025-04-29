"use client";

import styles from "./signUpForm.module.css";
import { BASE_URL } from "@/env";
import { Controller } from "react-hook-form";
import Input from "../input/Input";
import PasswordInput from "../passwordInput/PasswordInput";
import UserSpinner from "../loadingSpinners/UserSpinner";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToken, useAdmin } from "../GlobalContext";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import useAuth from "@/hooks/auth.hook";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";
import fields from "./fields";

const SignUpForm = () => {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();
  const { token } = useToken();
  const [error, setError] = useState("");
  const router = useRouter();
  const authorize = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { query, queryState, resetQueryState } = useQuery();

  const onSubmit = (data) => {
    const { confirmPassword, ...body } = data;
    const headers = { "Content-type": "application/json" };

    if (isAdmin) headers.authorization = `Bearer ${token}`;

    query(`${BASE_URL}/user/signUp`, "POST", headers, JSON.stringify(body))
      .then((res) => {
        if (!isAdmin) {
          authorize(res);
          router.back();
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setTimeout(resetQueryState, 2000));
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
