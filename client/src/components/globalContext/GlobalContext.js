"use client";

import { ThemeProvider } from "@mui/material/styles";
import { createContext, useState, useRef, useMemo } from "react";
import { theme } from "./theme";
import { DEFAULT_PAGE_SIZE } from "@/hooks/constants";

export const Context = createContext();

const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const toursSearchParamsRef = useRef({
    formValues: null,
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const provider = useMemo(
    () => ({
      user,
      toursSearchParamsRef,
      isAdmin: !!user?.admin,
      setUser,
    }),
    [user],
  );

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={provider}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default GlobalContext;
