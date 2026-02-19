import LocationCityIcon from "@mui/icons-material/LocationCity";
import LanguageIcon from "@mui/icons-material/Language";
import SurfingIcon from "@mui/icons-material/Surfing";

import { BASE_URL } from "@/constants/queryPaths";

export const getTourInfo = (departureCity, destinationCountry, resortTitle) => [
  {
    Icon: LocationCityIcon,
    label: "Город вылета:",
    info: departureCity,
  },
  {
    Icon: LanguageIcon,
    label: "Страна прибытия:",
    info: destinationCountry,
  },
  {
    Icon: SurfingIcon,
    label: "Курорт:",
    info: resortTitle,
  },
];

export const getPhotoSrc = (
  destinationCountry,
  resortTitle,
  hotelTitle,
  name,
) =>
  `${BASE_URL}/uploads/${destinationCountry}/${resortTitle}/${hotelTitle}/${name ?? ""}`;
