"use client";

import TourSearchPanel from "./tourSearchPanel/TourSearchPanel";
import ToursList from "./toursList/ToursList";
import useQuery from "@/hooks/query.hook";

const TourWrapper = () => {
  const { query, isLoading, isError } = useQuery();

  return (
    <>
      <TourSearchPanel query={query} />
      <ToursList isLoading={isLoading} isError={isError} />
    </>
  );
};

export default TourWrapper;
