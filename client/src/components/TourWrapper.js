"use client";

import { useState } from "react";
import TourSearchPanel from "./tourSearchPanel/TourSearchPanel";
import ToursList from "./toursList/ToursList";
import { usePagination } from "@/hooks/pagination.hook";

const TourWrapper = () => {
  const [tours, setTours] = useState([]);
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    pagination,
    initialQuery,
    paginatedQuery,
    queryState: { isLoading, isError },
    paginatedQueryArgumentsRef,
  } = usePagination();

  return (
    <>
      <TourSearchPanel
        query={initialQuery}
        {...{ paginatedQueryArgumentsRef, setTours }}
      />
      <ToursList
        {...{
          isLoading,
          isError,
          page,
          setPage,
          pageSize,
          setPageSize,
          pagination,
          paginatedQuery,
          tours,
          setTours,
        }}
      />
    </>
  );
};

export default TourWrapper;
