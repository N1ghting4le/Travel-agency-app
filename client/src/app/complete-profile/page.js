"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleAuthToken } from "@/components/globalContext/hooks/useGoogleAuthToken";
import useQuery from "@/hooks/query.hook";
import useAuth from "@/hooks/auth.hook";
import Input from "@/components/input/Input";
import SubmitWrapper from "@/components/submitWrapper/SubmitWrapper";
import UserSpinner from "@/components/loadingSpinners/UserSpinner";
import { COMPLETE_PROFILE_ENDPOINT } from "@/constants/queryPaths";
import { fields } from "./fields";
import schema from "./schema";
import styles from "./page.module.css";

export default function CompleteProfile() {
  const { googleAuthToken, setGoogleAuthToken } = useGoogleAuthToken();
  const { authorize } = useAuth();
  const [error, setError] = useState(null);
  const router = useRouter();
  const { query, queryState, resetQueryState } = useQuery();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!googleAuthToken) {
      router.back();
    }
  }, []);

  const onSubmit = async (values) => {
    try {
      const res = await query(COMPLETE_PROFILE_ENDPOINT, {
        method: "POST",
        json: true,
        body: JSON.stringify(values),
        authorize: false,
        headers: {
          authorization: `Bearer ${googleAuthToken}`,
        },
      });

      authorize({ user: res, token: googleAuthToken });
      setGoogleAuthToken(null);
      reset();
      router.push("/");
    } catch (err) {
      setError(err.message);
      setTimeout(resetQueryState, 2000);
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Почти готово!</h1>
        <p>Пожалуйста, заполните данные для завершения регистрации</p>
        {fields.map(({ name, placeholder }) => (
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
        ))}
        <SubmitWrapper
          queryState={queryState}
          spinner={<UserSpinner />}
          btnText="Сохранить данные"
          errorMsg={error || "Произошла ошибка"}
          successText="Данные сохранены"
        />
      </form>
    </main>
  );
}
