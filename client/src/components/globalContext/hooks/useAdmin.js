"use client";

import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useAdmin = () => {
  const { isAdmin } = useContext(Context);

  return { isAdmin };
};
