"use client";

import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useUser = () => {
  const { user, setUser } = useContext(Context);

  return { user, setUser };
};
