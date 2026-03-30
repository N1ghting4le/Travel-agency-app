"use client";

import styles from "./styles.module.css";
import {
  GET_HOTELS_ADMIN_API_ENDPOINT,
  deleteHotelApiEndpoint,
} from "@/constants/queryPaths";
import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import useQuery from "@/hooks/query.hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import schema from "./schema";
import SubmitBtn from "../submitBtn/SubmitBtn";
import Input from "../input/Input";
import { Table } from "../table";
import { usePagination } from "@/hooks/pagination.hook";
import { generateColumns } from "./utils";
import "dayjs/locale/ru";

export function AdminHotelsView() {
  const [hotels, setHotels] = useState([]);
  const {
    page,
    setPage,
    pagination,
    initialQuery,
    paginatedQuery,
    isInitialQueryExecuted,
  } = usePagination();
  const { query } = useQuery();
  const { isAdmin } = useAdmin();

  const { handleSubmit, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      hotelTitle: "",
    },
  });

  const sendParams = async (data) => {
    const res = await initialQuery(GET_HOTELS_ADMIN_API_ENDPOINT, {}, data);
    setHotels(res);
  };

  const updateHotels = async () => {
    const updatedHotels = await paginatedQuery();
    setHotels(updatedHotels);
  };

  useEffect(() => {
    sendParams(getValues());
  }, []);

  useEffect(() => {
    if (isInitialQueryExecuted) {
      updateHotels();
    }
  }, [page]);

  const deleteHotel = (id) => async () => {
    await query(deleteHotelApiEndpoint(id), { method: "DELETE" });
    updateHotels();
  };

  const handleChange = (field) => (e) => {
    setValue(field, e.target.value, { shouldValidate: true });
  };

  const columns = useMemo(() => generateColumns(deleteHotel), [paginatedQuery]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(sendParams)}>
        <Input
          name="hotelTitle"
          placeholder="Название отеля"
          onChange={handleChange("hotelTitle")}
        />
        <SubmitBtn style={{ height: 56, paddingInline: 16 }}>
          Применить
        </SubmitBtn>
      </form>
      <Table data={hotels} {...{ columns, page, setPage, pagination }} />
    </div>
  );
}
