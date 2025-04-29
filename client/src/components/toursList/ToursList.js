'use client';

import styles from "./toursList.module.css";
import { labelStyle } from "../input/Input";
import Image from "next/image";
import AccordionContainer from "../accordionContainer/AccordionContainer";
import ToursListItem from "../toursListItem/ToursListItem";
import TourLoading from "../loadingSpinners/TourLoading";
import { Checkbox, FormControlLabel, Slider } from "@mui/material";
import { useState } from "react";
import { useTours } from "../GlobalContext";
import icon from "../../public/landing_icon.png";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";

const ToursList = ({ queryState }) => {
    const min = 50, max = 1200;
    const { tours } = useTours();
    const [priceRange, setPriceRange] = useState([min, max]);
    const [minRating, setMinRating] = useState(0);
    const [activeNutrTypes, setActiveNutrTypes] = useState(nutritionTypes.map(type => type.value));
    const [activeRoomTypes, setActiveRoomTypes] = useState(roomTypes.map(type => type.value));

    const handleSliderChange = (_, newRange) => setPriceRange(newRange);

    const toggleCheckbox = (e, setter) => {
        if (e.target.checked) {
            setter(arr => [...arr, e.target.value]);
        } else {
            setter(arr => arr.filter(item => item !== e.target.value));
        }
    }

    const renderCheckboxFields = (arr, setter) => arr.map(item => {
        const { value, descr } = item;

        return (
            <FormControlLabel
                key={value}
                control={
                    <Checkbox
                        value={value}
                        sx={{
                            marginLeft: "10px",
                            "&.MuiCheckbox-root": {
                                paddingBlock: "2.5px"
                            }
                        }}
                        size="small"
                        defaultChecked
                        onClick={(e) => toggleCheckbox(e, setter)}/>
                }
                label={`${value} - ${descr}`}
                sx={{
                    "& .MuiFormControlLabel-label": { 
                        fontFamily: labelStyle.fontFamily,
                        fontWeight: 500,
                        fontSize: "14px",
                        alignSelf: "center"
                    },
                    alignItems: "flex-start"
                }}
            />
        );
    });

    const renderListItems = () => tours.filter(tour => {
        const { basePrice, avgMark, hotel } = tour;
        const { nutritionTypes, roomTypes } = hotel;

        return basePrice >= priceRange[0] && basePrice <= priceRange[1] && avgMark >= minRating
                && nutritionTypes.some(type => activeNutrTypes.includes(type))
                && roomTypes.some(type => activeRoomTypes.includes(type))
    }).map(tour => <ToursListItem key={tour.id} tour={tour}/>);

    switch (queryState) {
        case "pending": return <TourLoading/>;
        case "error": return <p>Произошла ошибка</p>;
    }

    const listItems = renderListItems();

    return tours.length ? (
        <div className={styles.wrapper}>
            <div className={styles.filters}>
                <p className={styles.title}>Фильтры</p>
                <AccordionContainer titleEl={<p className={styles.subTitle}>Цена</p>}>
                    <div className={styles.sliderWrapper}>
                        <Slider
                            value={priceRange}
                            min={min}
                            max={max}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            sx={{
                                width: "94%",
                                margin: "0 auto",
                                ".MuiSlider-thumb": {
                                    color: "#8DD3BB"
                                },
                                ".MuiSlider-track, .MuiSlider-rail": {
                                    color: "#112211",
                                    height: 2
                                }
                            }}
                        />
                        <p className={styles.edgePrice}>${min}</p>
                        <p className={styles.edgePrice}>${max}</p>
                    </div>
                </AccordionContainer>
                <AccordionContainer titleEl={<p className={styles.subTitle}>Рейтинг</p>}>
                    <div className={styles.ratingItems}>
                        {Array(5).fill().map((_, i) => 
                            <p key={i} 
                                className={`${styles.rating} ${minRating === i && styles.activeRating}`}
                                onClick={() => setMinRating(i)}>{i}+</p>)}
                    </div>
                </AccordionContainer>
                <AccordionContainer titleEl={<p className={styles.subTitle}>Типы питания</p>}>
                    <div className={styles.checkboxWrapper}>
                        {renderCheckboxFields(nutritionTypes, setActiveNutrTypes)}
                    </div>
                </AccordionContainer>
                <AccordionContainer titleEl={<p className={styles.subTitle}>Типы номеров</p>}>
                    <div className={styles.checkboxWrapper}>
                        {renderCheckboxFields(roomTypes, setActiveRoomTypes)}
                    </div>
                </AccordionContainer>
            </div>
            <ul className={styles.toursList}>
                {listItems}
            </ul>
        </div>
    ) : (
        <div className={styles.noTours}>
            <div className={styles.bg}/>
            <p className={styles.noToursText}>Здесь появятся найденные туры</p>
            <Image src={icon} alt="icon" className={styles.bgImage}/>
        </div>
    );
}

export default ToursList;