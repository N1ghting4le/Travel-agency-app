"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GET_TOUR_STATS_API_ENDPOINT } from "@/constants/queryPaths";
import { usePagination } from "@/hooks/pagination.hook";
import { Table } from "@/components/table";
import styles from "@/components/table/styles.module.css";

const columns = [
  {
    accessorKey: "tourTitle",
    header: "Тур",
    cell: (info) => (
      <Link href={`/tours/${info.row.original.tourId}`} className={styles.link}>
        {info.getValue()}
      </Link>
    ),
  },
  {
    accessorKey: "destinationCountry",
    header: "Страна",
  },
  {
    accessorKey: "totalBookings",
    header: "Общее число бронирований",
  },
  {
    accessorKey: "totalAmount",
    header: "Общая стоимость бронирований",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  },
];

export function TableOfTours({ year, month, country }) {
  const [tours, setTours] = useState([]);
  const {
    page,
    setPage,
    pagination,
    initialQuery,
    paginatedQuery,
    isInitialQueryExecuted,
  } = usePagination();

  useEffect(() => {
    initialQuery(
      GET_TOUR_STATS_API_ENDPOINT,
      {},
      {
        year,
        month,
        country,
      },
    ).then(setTours);
  }, [year, month, country]);

  useEffect(() => {
    if (isInitialQueryExecuted) {
      paginatedQuery().then(setTours);
    }
  }, [page]);

  return <Table data={tours} {...{ columns, page, setPage, pagination }} />;
}
