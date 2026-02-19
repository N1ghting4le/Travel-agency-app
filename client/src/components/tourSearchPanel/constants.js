import {
  FlightTakeoff,
  FlightLand,
  Restaurant,
  KingBed,
} from "@mui/icons-material";

import departureCities from "@/lists/departureCities";
import countries from "@/lists/countries";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";

export const staticMenus = [
  {
    text: "Город вылета",
    name: "departureCity",
    values: departureCities,
    valueField: null,
    multiple: false,
    Icon: FlightTakeoff,
  },
  {
    text: "Страна",
    name: "destinationCountry",
    values: countries,
    valueField: null,
    multiple: false,
    Icon: FlightLand,
  },
  {
    text: "Питание",
    name: "nutrition",
    values: nutritionTypes,
    valueField: "descr",
    multiple: true,
    Icon: Restaurant,
  },
  {
    text: "Номер",
    name: "rooms",
    values: roomTypes,
    valueField: "descr",
    multiple: true,
    Icon: KingBed,
  },
];
