"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@/components/globalContext/hooks/useUser";
import useAuth from "@/hooks/auth.hook";
import useQuery from "@/hooks/query.hook";
import Input from "@/components/input/Input";
import SubmitWrapper from "@/components/submitWrapper/SubmitWrapper";
import UserSpinner from "@/components/loadingSpinners/UserSpinner";
import {
  COMPLETE_PROFILE_ENDPOINT,
  DELETE_UNFINISHED_PROFILE_ENDPOINT,
} from "@/constants/queryPaths";
import { fields } from "./fields";
import schema from "./schema";
import styles from "./page.module.css";

export default function CompleteProfile() {
  const { user, setUser } = useUser();
  const { logout } = useAuth();
  const [error, setError] = useState(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const shouldRedirect = !user || user.admin || user.name;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/");
    }
  }, [shouldRedirect]);

  useEffect(() => {
    if (isSubmitSuccessful || shouldRedirect) {
      return;
    }

    const onBeforeUnload = () => {
      query(DELETE_UNFINISHED_PROFILE_ENDPOINT, { method: "DELETE" });
      logout();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onBeforeUnload);
    };
  }, [isSubmitSuccessful, shouldRedirect, logout]);

  const { query, queryState, resetQueryState } = useQuery();

  const onSubmit = async (values) => {
    try {
      const res = await query(COMPLETE_PROFILE_ENDPOINT, {
        method: "PATCH",
        json: true,
        body: JSON.stringify(values),
      });

      setUser(res);
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
