"use client";

import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useTours = () => {
  const { tours, setTours, changeTour, changeAvgMark, deleteTour } =
    useContext(Context);

  return { tours, setTours, changeTour, changeAvgMark, deleteTour };
};
