"use client";

import styles from "./signInForm.module.css";
import { SIGN_IN_API_ENDPOINT } from "@/constants/queryPaths";
import { Controller } from "react-hook-form";
import Input from "../input/Input";
import PasswordInput from "../passwordInput/PasswordInput";
import UserSpinner from "../loadingSpinners/UserSpinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import useAuth from "@/hooks/auth.hook";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";

const SignInForm = () => {
  const [error, setError] = useState(null);
  const { authorize } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { query, queryState, resetQueryState } = useQuery();

  const onSubmit = async (data) => {
    try {
      const res = await query(SIGN_IN_API_ENDPOINT, {
        method: "POST",
        json: true,
        body: JSON.stringify(data),
        authorize: false,
      });
      authorize(res);
      router.back();
    } catch (err) {
      setError(err.message);
      setTimeout(resetQueryState, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        name="phoneOrEmail"
        control={control}
        render={({ field: { onChange } }) => (
          <Input
            placeholder="Адрес эл. почты или моб. тел."
            error={errors.phoneOrEmail}
            onChange={onChange}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange } }) => (
          <PasswordInput
            placeholder="Пароль"
            error={errors.password}
            onChange={onChange}
          />
        )}
      />
      <SubmitWrapper
        queryState={queryState}
        spinner={<UserSpinner />}
        btnText="Войти"
        errorMsg={error || "Произошла ошибка"}
        successText="Вход выполнен"
      />
    </form>
  );
};

export default SignInForm;
