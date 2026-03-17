"use client";

import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useTours = () => {
  const {
    tours,
    toursSearchParamsRef,
    setTours,
    changeTour,
    changeAvgMark,
    deleteTour,
  } = useContext(Context);

  return {
    tours,
    toursSearchParamsRef,
    setTours,
    changeTour,
    changeAvgMark,
    deleteTour,
  };
};
