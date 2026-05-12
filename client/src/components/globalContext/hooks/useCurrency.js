"use client";

import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useCurrency = () => {
  const { currency, conversionRate, setCurrency } = useContext(Context);

  return { currency, conversionRate, setCurrency };
};
