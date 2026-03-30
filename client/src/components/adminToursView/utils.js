import Link from "next/link";
import { ActionMenu } from "../actionMenu";
import { ListItemIcon, ListItemText } from "@mui/material";
import { Edit, Archive, Unarchive, DeleteForever } from "@mui/icons-material";
import styles from "@/components/table/styles.module.css";

export const generateColumns = (archiveOrRestoreTour, deleteTour) => [
  {
    accessorKey: "tourTitle",
    header: "Тур",
    cell: (info) => (
      <Link href={`/tours/${info.row.original.id}`} className={styles.link}>
        {info.getValue()}
      </Link>
    ),
  },
  {
    accessorKey: "departureCity",
    header: "Город вылета",
  },
  {
    accessorKey: "destinationCountry",
    header: "Страна",
  },
  {
    accessorKey: "resortTitle",
    header: "Курорт",
  },
  {
    accessorKey: "hotelTitle",
    header: "Отель",
  },
  {
    accessorKey: "basePrice",
    header: "Начальная цена",
    cell: (info) => `$${info.getValue()}`,
  },
  {
    id: "edit",
    size: 34,
    cell: ({ row }) => (
      <ActionMenu
        actions={[
          {
            children: (
              <Link
                href={`/admin/edit-tour/${row.original.id}`}
                style={{ display: "flex" }}
              >
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText>Редактировать</ListItemText>
              </Link>
            ),
          },
          {
            action: archiveOrRestoreTour(
              row.original.id,
              row.original.isArchived,
            ),
            children: (
              <>
                <ListItemIcon>
                  {row.original.isArchived ? <Unarchive /> : <Archive />}
                </ListItemIcon>
                <ListItemText>
                  {row.original.isArchived ? "Восстановить" : "В архив"}
                </ListItemText>
              </>
            ),
          },
          {
            action: deleteTour(row.original.id),
            children: (
              <>
                <ListItemIcon>
                  <DeleteForever />
                </ListItemIcon>
                <ListItemText>Удалить</ListItemText>
              </>
            ),
            disabled: row.original.hasBookings,
            tooltipText: row.original.hasBookings
              ? "Есть незавершенные бронирования этого тура"
              : null,
          },
        ]}
      />
    ),
  },
];
