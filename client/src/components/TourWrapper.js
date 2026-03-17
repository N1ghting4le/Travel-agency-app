"use client";

import TourSearchPanel from "./tourSearchPanel/TourSearchPanel";
import ToursList from "./toursList/ToursList";
import { usePagination } from "@/hooks/pagination.hook";

const TourWrapper = () => {
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
        {...{ paginatedQueryArgumentsRef }}
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
        }}
      />
    </>
  );
};

export default TourWrapper;
