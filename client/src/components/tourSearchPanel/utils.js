import BeachAccess from "@mui/icons-material/BeachAccess";
import Hotel from "@mui/icons-material/Hotel";

export const filterHotels = (hotels, pickedResorts, nutrition, rooms, stars) =>
  hotels
    .filter(
      (h) =>
        (!pickedResorts.length || pickedResorts.some((r) => r === h.resort)) &&
        (!nutrition.length ||
          nutrition.some((n) => h.nutritionTypes.includes(n.value))) &&
        (!rooms.length || rooms.some((r) => h.roomTypes.includes(r.value))) &&
        h.stars >= stars,
    )
    .map((h) => h.hotelTitle);

export const getResortsAndHotelsMenus = (resorts, hotels, isResortsSuccess, isHotelsSuccess) => [
  {
    name: "resorts",
    values: resorts,
    isSuccess: isResortsSuccess,
    text: "Курорт",
    Icon: BeachAccess,
  },
  {
    name: "hotels",
    values: hotels,
    isSuccess: isHotelsSuccess,
    text: "Отель",
    Icon: Hotel,
  }
];
