"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useQuery from "@/hooks/query.hook";
import { BASE_URL } from "@/env";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import styles from "./styles.module.css";

const pageSize = 25;

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
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({
    numberOfElements: 0,
    offset: 0,
    totalPages: 0,
    totalElements: 0,
    last: true,
  });
  const { query } = useQuery();

  useEffect(() => {
    let params = `year=${year}`;

    if (month !== null) {
      params += `&month=${month}`;
    }

    if (country) {
      params += `&country=${country}`;
    }

    params += `&page=${page}&pageSize=${pageSize}`;

    query(`${BASE_URL}/booking/tours?${params}`).then((res) => {
      const {
        content,
        pageable: { offset },
        totalElements,
        totalPages,
        last,
        numberOfElements,
      } = res;

      setTours(content);
      setPagination({
        offset,
        totalElements,
        totalPages,
        last,
        numberOfElements,
      });
    });
  }, [year, month, country, page]);

  const table = useReactTable({
    data: tours,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={styles.tableHeader}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tableRow}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.tableCell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((page) => page - 1)}
          disabled={page === 0}
          className={styles.btn}
        >
          <ChevronLeft />
        </button>
        <span>
          {page + 1} из {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage((page) => page + 1)}
          disabled={page === pagination.totalPages - 1}
          className={styles.btn}
        >
          <ChevronRight />
        </button>
        <p>
          элементы {pagination.offset + 1} -{" "}
          {pagination.offset + pagination.numberOfElements} из{" "}
          {pagination.totalElements}
        </p>
      </div>
    </div>
  );
}
