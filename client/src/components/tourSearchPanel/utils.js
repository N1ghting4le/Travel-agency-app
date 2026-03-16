import BeachAccess from "@mui/icons-material/BeachAccess";
import Hotel from "@mui/icons-material/Hotel";

export const getResortsAndHotelsMenus = (
  resorts,
  hotels,
  isResortsSuccess,
  isHotelsSuccess,
) => [
  {
    name: "resorts",
    values: resorts,
    valueField: "resortTitle",
    isSuccess: isResortsSuccess,
    text: "Курорт",
    Icon: BeachAccess,
  },
  {
    name: "hotels",
    values: hotels,
    valueField: "hotelTitle",
    isSuccess: isHotelsSuccess,
    text: "Отель",
    Icon: Hotel,
  },
];

export const extractValues = (arr, valueField) =>
  arr.map((item) => item[valueField]);
