"use client";

import styles from "./styles.module.css";
import {
  GET_TOURS_ADMIN_API_ENDPOINT,
  archiveTourApiEndpoint,
  restoreTourApiEndpoint,
  deleteTourApiEndpoint,
} from "@/constants/queryPaths";
import { useState, useEffect, useMemo, useCallback } from "react";
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

export function AdminToursView() {
  const [tours, setTours] = useState([]);
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
      tourTitle: "",
      includeArchived: true,
    },
  });

  const sendParams = async (data) => {
    const res = await initialQuery(GET_TOURS_ADMIN_API_ENDPOINT, {}, data);
    setTours(res);
  };

  const updateTours = async () => {
    const updatedTours = await paginatedQuery();
    setTours(updatedTours);
  };

  useEffect(() => {
    sendParams(getValues());
  }, []);

  useEffect(() => {
    if (isInitialQueryExecuted) {
      updateTours();
    }
  }, [page]);

  const archiveOrRestoreTour = (id, isArchived) => async () => {
    if (isArchived) {
      await query(restoreTourApiEndpoint(id));
    } else {
      await query(archiveTourApiEndpoint(id));
    }
    updateTours();
  };

  const deleteTour = (id) => async () => {
    await query(deleteTourApiEndpoint(id), { method: "DELETE" });
    updateTours();
  };

  const handleChange = (field) => (e) => {
    setValue(field, e.target.value, { shouldValidate: true });
  };

  const columns = useMemo(
    () => generateColumns(archiveOrRestoreTour, deleteTour),
    [paginatedQuery],
  );

  const enableRowSelection = useCallback((row) => !row.original.isArchived, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(sendParams)}>
        <Input
          name="tourTitle"
          placeholder="Название тура"
          onChange={handleChange("tourTitle")}
        />
        <SubmitBtn style={{ height: 56, paddingInline: 16 }}>
          Применить
        </SubmitBtn>
      </form>
      <Table
        data={tours}
        {...{ columns, page, setPage, pagination, enableRowSelection }}
      />
    </div>
  );
}
