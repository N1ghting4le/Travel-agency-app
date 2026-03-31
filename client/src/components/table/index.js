"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pagination } from "../pagination";
import { classNames } from "@/utils/classNames";
import { OverflowTip } from "../overflowTip";
import { Typography } from "@mui/material";

import styles from "./styles.module.css";

export function Table({
  data,
  columns,
  page,
  setPage,
  pagination,
  enableRowSelection,
}) {
  const table = useReactTable({
    data,
    columns,
    enableRowSelection,
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
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={classNames([
                  styles.tableRow,
                  { name: styles.disabled, apply: !row.getCanSelect() },
                ])}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={classNames([
                      styles.tableCell,
                      {
                        name: styles.editCell,
                        apply: cell.column.columnDef.id === "edit",
                      },
                    ])}
                  >
                    <OverflowTip>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </OverflowTip>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination {...{ page, setPage, pagination }} />
      </div>
    </div>
  );
}
