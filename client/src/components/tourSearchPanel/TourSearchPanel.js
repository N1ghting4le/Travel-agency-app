"use client";

import { BASE_URL } from "@/env";
import styles from "./tourSearchPanel.module.css";
import SelectMenu from "../selectMenu/SelectMenu";
import SubmitBtn from "../submitBtn/SubmitBtn";
import Stars from "../stars/Stars";
import {
  Place,
  FlightTakeoff,
  FlightLand,
  Restaurant,
  KingBed,
  BeachAccess,
  Hotel,
} from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTours } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import countries from "@/lists/countries";
import departureCities from "@/lists/departureCities";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";

const forStaticMenus = [
  ["Город вылета", "departureCity", departureCities, false, FlightTakeoff],
  ["Страна", "destinationCountry", countries, false, FlightLand],
  [
    "Питание",
    "nutrition",
    nutritionTypes.map((t) => `${t.value} - ${t.descr}`),
    true,
    Restaurant,
  ],
  [
    "Номер",
    "rooms",
    roomTypes.map((t) => `${t.value} - ${t.descr}`),
    true,
    KingBed,
  ],
];

const TourSearchPanel = ({ query, resetQueryState }) => {
  const [stars, setStars] = useState(1);
  const [resorts, setResorts] = useState([]);
  const [hotels, setHotels] = useState([]);
  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      departureCity: departureCities[0],
      destinationCountry: countries[0],
      nutrition: [],
      rooms: [],
      resorts: [],
      hotels: [],
    },
  });
  const { setTours } = useTours();
  const { query: getResorts, queryState: resortsState } = useQuery();
  const { query: getHotels, queryState: hotelsState } = useQuery();
  const country = watch("destinationCountry");
  const pickedResorts = watch("resorts");
  const nutrition = watch("nutrition");
  const rooms = watch("rooms");

  useEffect(() => {
    setResorts([]);
    setValue("resorts", []);
    setHotels([]);
    setValue("hotels", []);
    getResorts(`${BASE_URL}/resort/get/${country}`).then((res) =>
      setResorts(res.map((r) => r.resortTitle))
    );
    getHotels(`${BASE_URL}/hotel/getHotels/${country}`).then((res) =>
      setHotels(res)
    );
  }, [country]);

  const showedHotels = useMemo(
    () =>
      hotels
        .filter(
          (h) =>
            (!pickedResorts.length ||
              pickedResorts.some((r) => r === h.resort)) &&
            (!nutrition.length ||
              nutrition.some((n) =>
                h.nutritionTypes.includes(n.split(" ")[0])
              )) &&
            (!rooms.length ||
              rooms.some((r) => h.roomTypes.includes(r.split(" ")[0]))) &&
            h.stars >= stars
        )
        .map((h) => h.hotelTitle),
    [hotels, pickedResorts, nutrition, rooms, stars]
  );

  useEffect(() => {
    setValue(
      "hotels",
      getValues("hotels").filter((h) => showedHotels.includes(h))
    );
  }, [showedHotels]);

  const onSubmit = (data) => {
    const body = {
      ...data,
      nutrition: data.nutrition.map((item) => item.split(" ")[0]),
      rooms: data.rooms.map((item) => item.split(" ")[0]),
      stars,
    };

    query(
      `${BASE_URL}/tour/getTours`,
      "POST",
      { "Content-type": "application/json" },
      JSON.stringify(body)
    )
      .then((res) => setTours(res))
      .finally(() => setTimeout(resetQueryState, 2000));
  };

  const forDynamicMenus = [
    ["resorts", resorts, resortsState, "Курорт", BeachAccess],
    ["hotels", showedHotels, hotelsState, "Отель", Hotel],
  ];

  const renderStaticMenus = () =>
    forStaticMenus.map(([text, name, values, multiple, Icon]) => (
      <SelectMenu
        key={name}
        values={values}
        name={name}
        control={control}
        multiple={multiple}
        disableClearable={!multiple}
      >
        <div className={styles.placeholder}>
          <Icon fontSize="small" />
          <p>{text}</p>
        </div>
      </SelectMenu>
    ));

  const staticMenus = renderStaticMenus();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3>Поиск тура</h3>
      <div className={styles.menusWrapper}>{staticMenus}</div>
      <div className={styles.menusWrapper}>
        <div className={styles.stars}>
          <p>Звёздность отеля</p>
          <Stars stars={stars} setStars={setStars} />
        </div>
        {forDynamicMenus.map(([name, values, state, text, Icon]) => (
          <SelectMenu
            key={name}
            values={values}
            name={name}
            control={control}
            multiple={true}
            disabled={state !== "fulfilled"}
          >
            <div className={styles.placeholder}>
              <Icon fontSize="small" />
              <p>{text}</p>
            </div>
          </SelectMenu>
        ))}
        <SubmitBtn
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
            height: "100%",
          }}
        >
          <Place fontSize="small" />
          <p>Найти</p>
        </SubmitBtn>
      </div>
    </form>
  );
};

export default TourSearchPanel;
