import { BeachAccess, Luggage, Apartment, Badge } from "@mui/icons-material";

export const slotProps = {
  paper: {
    elevation: 0,
    sx: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
      mt: 1.5,
      "& .MuiAvatar-root": {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 19,
        width: 10,
        height: 10,
        bgcolor: "background.paper",
        transform: "translateY(-50%) rotate(45deg)",
        zIndex: 0,
      },
    },
  },
};

export const linkListItemStyle = {
  display: "flex",
  alignItems: "center",
  p: 0,
};

export const adminMenuItems = [
  {
    href: "/admin/add-hotel",
    Icon: Apartment,
    text: "Добавить отель",
  },
  {
    href: "/admin/add-tour",
    Icon: Luggage,
    text: "Добавить тур",
  },
  {
    href: "/admin/add-resort",
    Icon: BeachAccess,
    text: "Добавить курорт",
  },
  {
    href: "/admin/add-employee",
    Icon: Badge,
    text: "Добавить сотрудника",
  },
];
