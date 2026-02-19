"use client";

import styles from "./toursList.module.css";
import Image from "next/image";
import AccordionContainer from "../accordionContainer/AccordionContainer";
import ToursListItem from "../toursListItem/ToursListItem";
import TourLoading from "../loadingSpinners/TourLoading";
import { Checkbox, FormControlLabel, Slider } from "@mui/material";
import { useState } from "react";
import { useTours } from "../globalContext/hooks/useTours";
import icon from "../../public/landing_icon.png";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";
import {
  MIN_PRICE,
  MAX_PRICE,
  RATING_VALUES,
  checkboxStyle,
  formControlLabelStyle,
  sliderStyle,
} from "./constants";
import { filterTours } from "./utils";

const ToursList = ({ isLoading, isError }) => {
  const { tours } = useTours();
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [minRating, setMinRating] = useState(0);
  const [activeNutrTypes, setActiveNutrTypes] = useState(
    nutritionTypes.map((type) => type.value),
  );
  const [activeRoomTypes, setActiveRoomTypes] = useState(
    roomTypes.map((type) => type.value),
  );

  const handleSliderChange = (_, newRange) => {
    setPriceRange(newRange);
  };

  const toggleCheckbox = (setter) => (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setter((arr) => [...arr, value]);
    } else {
      setter((arr) => arr.filter((item) => item !== value));
    }
  };

  const handleRatingClick = (rating) => () => {
    setMinRating(rating);
  };

  const renderCheckboxFields = (arr, setter) =>
    arr.map(({ value, descr }) => (
      <FormControlLabel
        key={value}
        control={
          <Checkbox
            value={value}
            sx={checkboxStyle}
            size="small"
            defaultChecked
            onClick={toggleCheckbox(setter)}
          />
        }
        label={descr}
        sx={formControlLabelStyle}
      />
    ));

  const filteredTours = filterTours(
    tours,
    priceRange,
    minRating,
    activeNutrTypes,
    activeRoomTypes,
  );

  const nutritionTypesCheckboxes = renderCheckboxFields(
    nutritionTypes,
    setActiveNutrTypes,
  );
  const roomTypesCheckboxes = renderCheckboxFields(
    roomTypes,
    setActiveRoomTypes,
  );

  if (isLoading) {
    return <TourLoading />;
  }

  if (isError) {
    return <p>Произошла ошибка</p>;
  }

  if (!tours.length) {
    return (
      <div className={styles.noTours}>
        <div className={styles.bg} />
        <p className={styles.noToursText}>Здесь появятся найденные туры</p>
        <Image src={icon} alt="icon" className={styles.bgImage} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <p className={styles.title}>Фильтры</p>
        <AccordionContainer titleEl={<p className={styles.subTitle}>Цена</p>}>
          <div className={styles.sliderWrapper}>
            <Slider
              value={priceRange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              sx={sliderStyle}
            />
            <p className={styles.edgePrice}>${MIN_PRICE}</p>
            <p className={styles.edgePrice}>${MAX_PRICE}</p>
          </div>
        </AccordionContainer>
        <AccordionContainer
          titleEl={<p className={styles.subTitle}>Рейтинг</p>}
        >
          <div className={styles.ratingItems}>
            {RATING_VALUES.map((rating) => (
              <p
                key={rating}
                className={`${styles.rating} ${minRating === rating ? styles.activeRating : ""}`}
                onClick={handleRatingClick(rating)}
              >
                {rating}+
              </p>
            ))}
          </div>
        </AccordionContainer>
        <AccordionContainer
          titleEl={<p className={styles.subTitle}>Типы питания</p>}
        >
          <div className={styles.checkboxWrapper}>
            {nutritionTypesCheckboxes}
          </div>
        </AccordionContainer>
        <AccordionContainer
          titleEl={<p className={styles.subTitle}>Типы номеров</p>}
        >
          <div className={styles.checkboxWrapper}>{roomTypesCheckboxes}</div>
        </AccordionContainer>
      </div>
      <ul className={styles.toursList}>
        {filteredTours.map((tour) => (
          <ToursListItem key={tour.id} tour={tour} />
        ))}
      </ul>
    </div>
  );
};

export default ToursList;
