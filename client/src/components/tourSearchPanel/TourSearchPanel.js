"use client";

import {
  getResortsByCountryApiEndpoint,
  getHotelsByCountryEndpoint,
  GET_TOURS_API_ENDPOINT,
} from "@/constants/queryPaths";
import styles from "./tourSearchPanel.module.css";
import SelectMenu from "../selectMenu/SelectMenu";
import SubmitBtn from "../submitBtn/SubmitBtn";
import Stars from "../stars/Stars";
import Place from "@mui/icons-material/Place";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTours } from "../globalContext/hooks/useTours";
import useQuery from "@/hooks/query.hook";
import countries from "@/lists/countries";
import departureCities from "@/lists/departureCities";
import { staticMenus } from "./constants";
import { filterHotels, getResortsAndHotelsMenus } from "./utils";

const TourSearchPanel = ({ query }) => {
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
  const { query: getResorts, isSuccess: isResortsSuccess } = useQuery();
  const { query: getHotels, isSuccess: isHotelsSuccess } = useQuery();

  const country = watch("destinationCountry");
  const pickedResorts = watch("resorts");
  const nutrition = watch("nutrition");
  const rooms = watch("rooms");

  useEffect(() => {
    setResorts([]);
    setValue("resorts", []);
    setHotels([]);
    setValue("hotels", []);
    getResorts(getResortsByCountryApiEndpoint(country), {
      authorize: false,
    }).then((res) => setResorts(res.map((r) => r.resortTitle)));
    getHotels(getHotelsByCountryEndpoint(country), { authorize: false }).then(
      (res) => setHotels(res),
    );
  }, [setValue, getResorts, getHotels, country]);

  const showedHotels = useMemo(
    () => filterHotels(hotels, pickedResorts, nutrition, rooms, stars),
    [hotels, pickedResorts, nutrition, rooms, stars],
  );

  useEffect(() => {
    setValue(
      "hotels",
      getValues("hotels").filter((h) => showedHotels.includes(h)),
    );
  }, [showedHotels, setValue, getValues]);

  const onSubmit = async (data) => {
    const body = {
      ...data,
      nutrition: data.nutrition.map((item) => item.value),
      rooms: data.rooms.map((item) => item.value),
      stars,
    };

    const res = await query(GET_TOURS_API_ENDPOINT, {
      method: "POST",
      json: true,
      authorize: false,
      body: JSON.stringify(body),
    });
    setTours(res);
  };

  const resortsAndHotelsMenus = getResortsAndHotelsMenus(
    resorts,
    showedHotels,
    isResortsSuccess,
    isHotelsSuccess,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3>Поиск тура</h3>
      <div className={styles.menusWrapper}>
        {staticMenus.map(
          ({ text, name, values, valueField, multiple, Icon }) => (
            <SelectMenu
              key={name}
              values={values}
              valueField={valueField}
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
          ),
        )}
      </div>
      <div className={styles.menusWrapper}>
        <div className={styles.stars}>
          <p>Звёздность отеля</p>
          <Stars stars={stars} setStars={setStars} />
        </div>
        {resortsAndHotelsMenus.map(
          ({ name, values, isSuccess, text, Icon }) => (
            <SelectMenu
              key={name}
              values={values}
              name={name}
              control={control}
              multiple={true}
              disabled={!isSuccess}
            >
              <div className={styles.placeholder}>
                <Icon fontSize="small" />
                <p>{text}</p>
              </div>
            </SelectMenu>
          ),
        )}
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
