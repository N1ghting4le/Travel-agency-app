import Link from "next/link";
import { ActionMenu } from "../actionMenu";
import { ListItemIcon, ListItemText } from "@mui/material";
import { Edit, DeleteForever } from "@mui/icons-material";

export const generateColumns = (deleteHotel) => [
  {
    accessorKey: "hotelTitle",
    header: "Отель",
  },
  {
    accessorKey: "resortCountry",
    header: "Страна",
  },
  {
    accessorKey: "resortTitle",
    header: "Курорт",
  },
  {
    accessorKey: "hotelAddress",
    header: "Адрес",
  },
  {
    accessorKey: "hotelStars",
    header: "Звездность",
    size: 70,
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
                href={`/admin/edit-hotel/${row.original.id}`}
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
            action: deleteHotel(row.original.id),
            children: (
              <>
                <ListItemIcon>
                  <DeleteForever />
                </ListItemIcon>
                <ListItemText>Удалить</ListItemText>
              </>
            ),
            disabled: row.original.hasTours,
            tooltipText: row.original.hasTours
              ? "Есть туры включающие этот отель"
              : null,
          },
        ]}
      />
    ),
  },
];
