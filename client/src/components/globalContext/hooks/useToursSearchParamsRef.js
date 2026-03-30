"use client";

import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useToursSearchParamsRef = () => {
  const { toursSearchParamsRef } = useContext(Context);

  return { toursSearchParamsRef };
};
