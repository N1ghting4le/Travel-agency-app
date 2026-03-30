import BookOnline from "@mui/icons-material/BookOnline";
import Person from "@mui/icons-material/Person";
import Analytics from "@mui/icons-material/Analytics";

import { adminMenuItems } from "./constants";

export const getUserMenuItems = (isAdmin, id, role) => {
  if (isAdmin) {
    return adminMenuItems;
  }

  const isEmployee = role === "EMPL";
  const personalAccountMenuItem = {
    href: `/users/${id}`,
    Icon: Person,
    text: "Мой кабинет",
  };

  if (isEmployee) {
    return [
      personalAccountMenuItem,
      {
        href: "/bookings/new",
        Icon: BookOnline,
        text: "Новые бронирования",
      },
      {
        href: "/bookings/taken",
        Icon: BookOnline,
        text: "Бронирования, с которыми вы работаете",
      },
      {
        href: "/bookings/analytics",
        Icon: Analytics,
        text: "Аналитика бронирований",
      },
    ];
  }

  return [personalAccountMenuItem];
};
