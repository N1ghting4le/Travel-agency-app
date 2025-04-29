'use client';

import TourSearchPanel from "./tourSearchPanel/TourSearchPanel";
import ToursList from "./toursList/ToursList";
import useQuery from "@/hooks/query.hook";

const TourWrapper = () => {
    const { query, queryState, resetQueryState } = useQuery();

    return (
        <>
        <TourSearchPanel query={query} resetQueryState={resetQueryState}/>
        <ToursList queryState={queryState}/>
        </>
    );
}

export default TourWrapper;